import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';

const prisma = new PrismaClient();

// Local fallback enum (Prisma Client generation is currently failing; use string literals)
const S = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  CANCELLED: 'CANCELLED'
} as const;
type ScheduleStatus = typeof S[keyof typeof S];

const MAX_ATTEMPTS = 3;
const BACKOFF_MINUTES = [1, 5, 15]; // simple backoff steps

// Publication status fallback (mirrors PublicationStatus enum)
const PUBL = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  CANCELLED: 'CANCELLED'
} as const;
type PublicationStatus = typeof PUBL[keyof typeof PUBL];

async function processDueJobs() {
  const now = new Date();
  // Fetch due jobs
  const due = await prisma.scheduledPost.findMany({
    where: {
      status: S.PENDING,
      scheduledAt: { lte: now }
    },
    orderBy: { scheduledAt: 'asc' },
    take: 20
  });
  if (!due.length) return;

  for (const job of due) {
    try {
      // Lock: optimistic update to PROCESSING only if still PENDING
      const locked = await prisma.scheduledPost.updateMany({
        where: { id: job.id, status: S.PENDING },
        data: { status: S.PROCESSING, lastAttemptAt: now }
      });
      if (locked.count === 0) continue; // someone else took it

      const attemptNo = job.attemptCount + 1;
      const attemptRecord = await prisma.scheduledPostAttempt.create({
        data: {
          scheduledPostId: job.id,
          attemptNo,
          success: false,
          startedAt: new Date()
        }
      });

      const payload = {
        userId: job.userId,  // CRITICAL: Send userId so /api/posts can lookup webhook
        content_text: job.contentText,
        hashtags: job.hashtags,
        media: job.media,
        platforms: job.platforms,
        platform: job.platforms[0],
        scheduled_id: job.id,
        run_type: 'scheduled'
      };

      // For now call existing posts API (server will resolve webhook) - adjust if direct webhook preferred
      const target = process.env.SCHEDULER_PUBLISH_ENDPOINT || 'http://localhost:3000/api/posts';
      const res = await fetch(target, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'X-Scheduled-Id': job.id,
          'X-User-Id': job.userId,  // Also send in header
          'X-Internal-API-Key': process.env.INTERNAL_API_KEY || ''  // Authenticate as internal service
        },
        body: JSON.stringify(payload)
      });
      const body = await res.json().catch(() => ({}));
      
      // Special handling: if error is "No webhook URL", mark as skipped (don't retry)
      const noWebhookError = body?.error?.includes('No per-user webhook') || body?.error?.includes('provision');
      const success = res.ok && body?.success !== false;
      const shouldSkip = !success && res.status === 400 && noWebhookError;

      await prisma.scheduledPostAttempt.update({
        where: { id: attemptRecord.id },
        data: {
          success: shouldSkip ? true : success, // Treat skip as "success" to avoid retry
          finishedAt: new Date(),
          errorMessage: shouldSkip 
            ? 'SKIPPED: No webhook URL (user needs to provision social account)' 
            : (success ? null : body?.error || `HTTP ${res.status}`),
          executionId: res.headers.get('x-n8n-exec-id') || undefined,
          platformResults: body?.results ? body.results : undefined
        }
      });

      if (success || shouldSkip) {
        await prisma.scheduledPost.update({
          where: { id: job.id },
          data: {
            status: S.SUCCESS,
            externalResults: shouldSkip 
              ? [{ platform: job.platforms[0], success: false, error: 'No webhook - user needs social account' }]
              : (body?.results || body?.externalPostId ? [{
                  platform: job.platforms[0],
                  success: true,
                  externalPostId: body.externalPostId || body.results?.[0]?.externalPostId || null
                }] : undefined)
          }
        });
        if (shouldSkip) {
          console.log('[scheduler] job skipped (no webhook)', job.id);
        }
      } else {
        const newAttemptCount = attemptNo;
        if (newAttemptCount < MAX_ATTEMPTS) {
          const backoffIndex = newAttemptCount - 1;
          const delayMin = BACKOFF_MINUTES[backoffIndex] || BACKOFF_MINUTES[BACKOFF_MINUTES.length - 1];
          const nextTime = new Date(Date.now() + delayMin * 60_000);
          await prisma.scheduledPost.update({
            where: { id: job.id },
            data: {
              status: S.PENDING,
              attemptCount: newAttemptCount,
              scheduledAt: nextTime
            }
          });
        } else {
          await prisma.scheduledPost.update({
            where: { id: job.id },
            data: { status: S.ERROR, attemptCount: newAttemptCount }
          });
        }
      }
    } catch (e: any) {
      console.error('[scheduler] job error', job.id, e.message);
      // Fail hard without retry increment if locking or critical error
      await prisma.scheduledPost.update({
        where: { id: job.id },
        data: { status: S.ERROR }
      }).catch(() => {});
    }
  }
}

async function processDuePublications() {
  const now = new Date();
  const due = await prisma.contentPublication.findMany({
    where: { status: PUBL.PENDING, scheduledAt: { lte: now } },
    orderBy: { scheduledAt: 'asc' },
    take: 30,
    include: { content: true, socialAccount: true }
  });
  if (!due.length) return;
  for (const pub of due) {
    try {
      const locked = await prisma.contentPublication.updateMany({
        where: { id: pub.id, status: PUBL.PENDING },
        data: { status: PUBL.PROCESSING, lastAttemptAt: now }
      });
      if (locked.count === 0) continue;
      const attemptNo = pub.attemptCount + 1;
      const payload = {
        userId: pub.content.userId,  // CRITICAL: Send userId
        content_text: pub.captionOverride || pub.content.content,
        hashtags: pub.content.hashtags,
        media: pub.mediaOverride.length ? pub.mediaOverride : [],
        platform: pub.socialAccount.platform,
        platforms: [pub.socialAccount.platform],
        scheduled_publication_id: pub.id,
        run_type: 'scheduled-publication'
      };
      const target = process.env.SCHEDULER_PUBLISH_ENDPOINT || 'http://localhost:3000/api/posts';
      const res = await fetch(target, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'X-Publication-Id': pub.id,
          'X-User-Id': pub.content.userId,
          'X-Internal-API-Key': process.env.INTERNAL_API_KEY || ''
        },
        body: JSON.stringify(payload)
      });
      const body = await res.json().catch(() => ({}));
      const success = res.ok && body?.success !== false;
      if (success) {
        await prisma.contentPublication.update({
          where: { id: pub.id },
          data: {
            status: PUBL.SUCCESS,
            publishedAt: new Date(),
            attemptCount: attemptNo,
            externalPostId: body.externalPostId || body.results?.[0]?.externalPostId || null,
            errorMessage: null
          }
        });
      } else {
        if (attemptNo < MAX_ATTEMPTS) {
          const delayMin = BACKOFF_MINUTES[attemptNo - 1] || BACKOFF_MINUTES[BACKOFF_MINUTES.length - 1];
          const nextTime = new Date(Date.now() + delayMin * 60_000);
          await prisma.contentPublication.update({
            where: { id: pub.id },
            data: {
              status: PUBL.PENDING,
              attemptCount: attemptNo,
              scheduledAt: nextTime,
              errorMessage: body?.error || `HTTP ${res.status}`
            }
          });
        } else {
          await prisma.contentPublication.update({
            where: { id: pub.id },
            data: { status: PUBL.ERROR, attemptCount: attemptNo, errorMessage: body?.error || `HTTP ${res.status}` }
          });
        }
      }
    } catch (e: any) {
      console.error('[publication] job error', pub.id, e.message);
      await prisma.contentPublication.update({ where: { id: pub.id }, data: { status: PUBL.ERROR, errorMessage: e.message } }).catch(() => {});
    }
  }
  // Optionally mark parent content PUBLISHED if all publications successful
  const contentIds = Array.from(new Set(due.map((d: { contentId: string }) => d.contentId)));
  for (const cid of contentIds) {
    const remaining = await prisma.contentPublication.count({ where: { contentId: cid, status: { in: [PUBL.PENDING, PUBL.PROCESSING] } } });
    if (remaining === 0) {
      const anyError = await prisma.contentPublication.count({ where: { contentId: cid, status: PUBL.ERROR } });
      if (anyError === 0) {
        await prisma.content.update({ where: { id: cid }, data: { status: 'PUBLISHED', publishedAt: new Date() } }).catch(() => {});
      }
    }
  }
}

async function main() {
  console.log('[scheduler] starting cron worker');
  // Run once at start
  await processDueJobs().catch(e => console.error(e));
  await processDuePublications().catch(e => console.error(e));
  // Every minute
  cron.schedule('* * * * *', () => {
    processDueJobs().catch(e => console.error('[scheduler] tick error', e));
    processDuePublications().catch(e => console.error('[publication] tick error', e));
  });
}

main().catch(e => {
  console.error('Fatal scheduler error', e);
  process.exit(1);
});

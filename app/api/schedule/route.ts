import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fallback enum values while Prisma Client enum export is unavailable
const S = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  CANCELLED: 'CANCELLED'
} as const;
type ScheduleStatus = typeof S[keyof typeof S];

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { content_text, hashtags = [], media = [], platforms = [], scheduled_at, timezone = 'UTC', draftId, recurrence_rule } = data;
    if (!content_text || !platforms.length || !scheduled_at) {
      return NextResponse.json({ success: false, error: 'Missing content_text, platforms or scheduled_at' }, { status: 400 });
    }
    const when = new Date(scheduled_at);
    if (isNaN(when.getTime())) {
      return NextResponse.json({ success: false, error: 'Invalid scheduled_at' }, { status: 400 });
    }
    // TODO: auth - assume userId from session; placeholder:
    const userId = data.userId || 'demo-user';
    const job = await prisma.scheduledPost.create({
      data: {
        userId,
        draftContentId: draftId || null,
        contentText: content_text,
        hashtags,
        media,
        platforms,
        scheduledAt: when,
        timezone,
        recurrenceRule: recurrence_rule || null,
        status: S.PENDING
      }
    });
    return NextResponse.json({ success: true, job });
  } catch (e: any) {
    console.error('[schedule.create]', e);
    return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const statusParam = url.searchParams.get('status');
    const status = statusParam && Object.values(S).includes(statusParam as any) ? statusParam as ScheduleStatus : null;
    // TODO auth user
    const userId = url.searchParams.get('userId') || 'demo-user';
    const where: any = { userId };
    if (status) where.status = status;
    if (from) where.scheduledAt = { ...(where.scheduledAt || {}), gte: new Date(from) };
    if (to) where.scheduledAt = { ...(where.scheduledAt || {}), lte: new Date(to) };
    const jobs = await prisma.scheduledPost.findMany({ where, orderBy: { scheduledAt: 'asc' } });
    return NextResponse.json({ success: true, jobs });
  } catch (e: any) {
    console.error('[schedule.list]', e);
    return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 });
  }
}

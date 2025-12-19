import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { jwtVerify } from "jose"
import { normalizeMediaToR2 } from "@/lib/r2"

// Simple GET for health/debug (helps verify route not 404)
export async function GET() {
  return NextResponse.json({ success: true, message: 'posts route alive' })
}

export async function POST(req: NextRequest) {
  try {
    console.log('[api/posts] incoming POST')
    const N8N_BASE_URL = process.env.N8N_BASE_URL
    const N8N_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET
    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
    const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY

    if (!N8N_BASE_URL || !N8N_WEBHOOK_SECRET) {
      return NextResponse.json(
        { success: false, error: "Missing N8N_BASE_URL or N8N_WEBHOOK_SECRET in env" },
        { status: 500 },
      )
    }

    const payload = await req.json()
    const { scheduled_at, webhookUrl: clientWebhookUrl, isTest } = payload || {}

    // Allow server-to-server authentication via internal header
    const internalHeader = req.headers.get('x-internal-api-key') || req.headers.get('X-Internal-API-Key')
    const internalAuth = !!INTERNAL_API_KEY && internalHeader === INTERNAL_API_KEY

    // Resolve userId from either cookie (browser) or body/header (internal calls)
    let resolvedUserId: string | undefined
    try {
      // First try payload userId (for both UI and internal calls)
      if ((payload as any)?.userId) {
        resolvedUserId = (payload as any).userId
        console.log('[api/posts] userId from payload:', resolvedUserId)
      }
      // Then try header (for internal calls)
      if (!resolvedUserId && internalAuth) {
        resolvedUserId = req.headers.get('x-user-id') || undefined
        console.log('[api/posts] userId from header:', resolvedUserId)
      }
      // Finally try JWT cookie (for browser calls)
      if (!resolvedUserId) {
        const authCookie = req.cookies.get("auth-token")?.value
        if (authCookie) {
          const { payload: tokenPayload } = await jwtVerify(authCookie, JWT_SECRET)
          resolvedUserId = (tokenPayload as any)?.userId as string | undefined
          console.log('[api/posts] userId from JWT:', resolvedUserId)
        }
      }
    } catch (e) {
      console.warn('/api/posts: userId resolve failed', e)
    }

    // Try to route to the per-user workflow webhook if available
    let userWebhookUrl: string | null = null
    try {
      if (resolvedUserId) {
        const user = await prisma.user.findUnique({ where: { id: resolvedUserId } })
        userWebhookUrl = user?.n8nWebhookUrl ?? null
        console.log('[api/posts] resolved user webhook:', { userId: resolvedUserId, userWebhookUrl })
      }
    } catch (e) {
      // Non-fatal: fall back to client-provided webhook below
      console.warn("/api/posts: user lookup failed, using client webhook if provided")
    }

    // Prefer explicit webhookUrl from client if provided and matches base URL
    let targetUrl = userWebhookUrl || null
    if (!targetUrl && typeof clientWebhookUrl === 'string' && clientWebhookUrl.startsWith(N8N_BASE_URL)) {
      targetUrl = clientWebhookUrl
      console.log('[api/posts] using client webhook:', targetUrl)
    }
    
    // Convert to webhook-test if this is a test/ping request
    if (isTest && targetUrl) {
      targetUrl = targetUrl.replace('/webhook/', '/webhook-test/')
      console.log('[api/posts] converted to test webhook:', targetUrl)
    }
    
    console.log('[api/posts] final targetUrl:', targetUrl)
    // If still missing, we cannot publish (no generic global workflow path exists)
    if (!targetUrl) {
      return NextResponse.json(
        { success: false, error: 'No per-user webhook URL found. Please provision a social account before publishing.' },
        { status: 400 }
      )
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }
    // Only attach secret for the global endpoint; per-user webhook already has unique path/secret baked in
    // If using generic global workflow (deprecated) secret would be required, but we now only support per-user webhooks
    if (!userWebhookUrl && !clientWebhookUrl) headers["X-Webhook-Secret"] = N8N_WEBHOOK_SECRET

    // Helper to call webhook with a specific platform value
    const callOnce = async (platform: string) => {
      console.log('[api/posts] calling webhook', { platform, targetUrl })
      const body = { ...payload, platform }
      const res = await fetch(targetUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      })
      const execId = res.headers.get("x-execution-id") || res.headers.get("x-n8n-execution-id") || undefined
      const data = await res.json().catch(() => ({}))
      // Treat n8n logical failure as error even if HTTP 200
      const logicalOk = data && data.success !== false && !data.error
      const ok = res.ok && logicalOk
      if (!ok) {
        console.warn('[api/posts] webhook call failed', { platform, status: res.status, data })
      }
      return { ok, status: res.status, data, execId }
    }

    // If client sent platforms array, fan-out per platform; otherwise send single with provided or derived platform
    const platforms = Array.isArray((payload as any)?.platforms) ? (payload as any).platforms as string[] : []
    const singlePlatform = (payload as any)?.platform || (platforms.length === 1 ? platforms[0] : undefined)

    let execId: string | undefined
    // Normalize media: upload data URLs to R2 (publish-time)
    try {
      const userIdForMedia = resolvedUserId || 'anonymous'
      if (Array.isArray((payload as any)?.media)) {
        (payload as any).media = await normalizeMediaToR2(userIdForMedia, (payload as any).media)
      }
    } catch (mediaErr) {
      console.warn('[api/posts] media normalize failed', mediaErr)
    }
    if (platforms.length > 1) {
      const results = [] as Array<{ platform: string; ok: boolean; status: number; data: any; execId?: string }>
      for (const pf of platforms) {
        const r = await callOnce(pf)
        if (!execId && r.execId) execId = r.execId
        results.push({ platform: pf, ok: r.ok, status: r.status, data: r.data, execId: r.execId })
      }
      const allOk = results.every(r => r.ok)

      // Save published content to database if successful
      if (allOk) {
        try {
          const userId = resolvedUserId
          if (userId) {
            const title = (payload.content_text || '').split(/\n+/)[0]?.slice(0, 80) || 'Bài đăng'
            await prisma.content.create({
              data: {
                userId,
                title,
                content: payload.content_text || '',
                hashtags: Array.isArray(payload.hashtags) ? payload.hashtags : [],
                platforms,
                media: Array.isArray((payload as any)?.media) ? (payload as any).media as string[] : [],
                type: 'POST',
                status: 'PUBLISHED',
                publishedAt: new Date(),
              },
            })
          }
        } catch (saveErr) {
          console.error('[api/posts] failed to save published content', saveErr)
          // Non-fatal: post was published successfully
        }
      }

      const respHeaders = execId ? { "x-n8n-exec-id": execId } : undefined
      return NextResponse.json(
        { success: allOk, results, targetUrl, execId },
        { status: allOk ? 200 : 207, headers: respHeaders },
      )
    } else {
      // Single platform case (explicit or derived)
      const pf = singlePlatform || 'facebook'
      const r = await callOnce(pf)
      const respHeaders = r.execId ? { "x-n8n-exec-id": r.execId } : undefined
      if (!r.ok) {
        return NextResponse.json(
          { success: false, error: r.data?.error || "n8n error", status: r.status, data: r.data, execId: r.execId, targetUrl },
          { status: r.status || 502, headers: respHeaders },
        )
      }

      // Save published content to database
      try {
        const userId = resolvedUserId
        if (userId) {
          const title = (payload.content_text || '').split(/\n+/)[0]?.slice(0, 80) || 'Bài đăng'
          await prisma.content.create({
            data: {
              userId,
              title,
              content: payload.content_text || '',
              hashtags: Array.isArray(payload.hashtags) ? payload.hashtags : [],
              platforms: platforms.length > 0 ? platforms : [pf],
              media: Array.isArray((payload as any)?.media) ? (payload as any).media as string[] : [],
              type: 'POST',
              status: 'PUBLISHED',
              publishedAt: new Date(),
            },
          })
        }
      } catch (saveErr) {
        console.error('[api/posts] failed to save published content', saveErr)
        // Non-fatal: post was published successfully
      }

      return NextResponse.json(
        { success: true, data: r.data, targetUrl, execId: r.execId },
        { status: 200, headers: respHeaders },
      )
    }
  } catch (err) {
    console.error('[api/posts] unhandled error', err)
    return NextResponse.json({ success: false, error: "Failed to create post" }, { status: 500 })
  }
}

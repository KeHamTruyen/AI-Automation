import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { jwtVerify } from "jose"

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

    if (!N8N_BASE_URL || !N8N_WEBHOOK_SECRET) {
      return NextResponse.json(
        { success: false, error: "Missing N8N_BASE_URL or N8N_WEBHOOK_SECRET in env" },
        { status: 500 },
      )
    }

    const payload = await req.json()
    const { scheduled_at, webhookUrl: clientWebhookUrl } = payload || {}

    // Try to route to the per-user workflow webhook if available
    let userWebhookUrl: string | null = null
    try {
      const authCookie = req.cookies.get("auth-token")?.value
      if (authCookie) {
        const { payload: tokenPayload } = await jwtVerify(authCookie, JWT_SECRET)
        const userId = (tokenPayload as any)?.userId as string | undefined
        if (userId) {
          const user = await prisma.user.findUnique({ where: { id: userId } })
          userWebhookUrl = user?.n8nWebhookUrl ?? null
        }
      }
    } catch (e) {
      // Non-fatal: fall back to global webhook below
      console.warn("/api/posts: auth decode or user lookup failed, using global webhook")
    }

    // Prefer explicit webhookUrl from client if provided and matches base URL
    let targetUrl = userWebhookUrl || null
    if (!targetUrl && typeof clientWebhookUrl === 'string' && clientWebhookUrl.startsWith(N8N_BASE_URL)) {
      targetUrl = clientWebhookUrl
    }
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
    if (platforms.length > 1) {
      const results = [] as Array<{ platform: string; ok: boolean; status: number; data: any; execId?: string }>
      for (const pf of platforms) {
        const r = await callOnce(pf)
        if (!execId && r.execId) execId = r.execId
        results.push({ platform: pf, ok: r.ok, status: r.status, data: r.data, execId: r.execId })
      }
      const allOk = results.every(r => r.ok)
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

import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const N8N_BASE_URL = process.env.N8N_BASE_URL
    const N8N_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET

    if (!N8N_BASE_URL || !N8N_WEBHOOK_SECRET) {
      return NextResponse.json(
        { success: false, error: "Missing N8N_BASE_URL or N8N_WEBHOOK_SECRET in env" },
        { status: 500 },
      )
    }

    const body = await req.json()

    const n8nUrl = `${N8N_BASE_URL.replace(/\/$/, "")}/webhook/create-content`
    const res = await fetch(n8nUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": N8N_WEBHOOK_SECRET,
      },
      body: JSON.stringify(body),
    })

    // Try to parse JSON first; if it fails, capture raw text for troubleshooting
    let data: any = null
    let rawText: string | null = null
    try {
      data = await res.json()
    } catch {
      try {
        rawText = await res.text()
      } catch {
        rawText = null
      }
    }

    // Forward n8n execution id if present (helps correlate in n8n Executions)
    const execId = res.headers.get("x-execution-id") || res.headers.get("x-n8n-execution-id") || undefined

    if (!res.ok) {
      // Log more details server-side for debugging
      console.error("n8n proxy error", {
        url: n8nUrl,
        status: res.status,
        execId,
        data,
        rawText,
      })
      return NextResponse.json(
        {
          success: false,
          error: "n8n error",
          status: res.status,
          data: data ?? { message: rawText ?? "No response body" },
          execId,
        },
        { status: res.status || 502 },
      )
    }

    const payload = data ?? { raw: rawText }
    return NextResponse.json(payload, { status: 200, headers: execId ? { "x-n8n-exec-id": execId } : undefined })
  } catch (err) {
    console.error("n8n proxy exception", err)
    return NextResponse.json({ success: false, error: "Proxy failed" }, { status: 500 })
  }
}

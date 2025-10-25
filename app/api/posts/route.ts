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

    const payload = await req.json()
    const { scheduled_at } = payload || {}

    const path = scheduled_at ? "/webhook/schedule-post" : "/webhook/post-now"

    const res = await fetch(`${N8N_BASE_URL.replace(/\/$/, "")}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": N8N_WEBHOOK_SECRET,
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "n8n error", status: res.status, data },
        { status: res.status || 502 },
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to create post" }, { status: 500 })
  }
}

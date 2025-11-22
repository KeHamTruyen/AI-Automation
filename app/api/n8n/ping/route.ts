import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as any
    const webhookUrl: string | undefined = body.webhookUrl
    const payload: any = body.payload || {}

    if (!webhookUrl) {
      return NextResponse.json({ success: false, error: 'Missing webhookUrl' }, { status: 400 })
    }
    if (!/^https:\/\/[^/]+\/webhook-test\//.test(webhookUrl)) {
      return NextResponse.json({ success: false, error: 'Invalid test webhook URL' }, { status: 400 })
    }

    const started = Date.now()
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const text = await res.text().catch(() => '')
    let data: any = null
    try { data = text ? JSON.parse(text) : null } catch { data = { raw: text } }

    const execId = res.headers.get('x-n8n-execution-id') || res.headers.get('x-n8n-exec-id') || null
    const ok = res.ok && (data?.success !== false)
    const durationMs = Date.now() - started
    // Include rawText for debugging even if JSON parsed
    return NextResponse.json({ success: ok, data, execId, status: res.status, rawText: text, durationMs })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Ping failed' }, { status: 500 })
  }
}
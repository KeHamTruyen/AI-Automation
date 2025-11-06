import { NextResponse } from "next/server"

function json(data: any, status = 200) {
  return NextResponse.json(data, { status })
}

export async function GET() {
  const base = process.env.N8N_API_BASE_URL || ""
  const apiKey = process.env.N8N_API_KEY || ""
  const baseUrl = base.endsWith("/") ? base.slice(0, -1) : base
  const url = `${baseUrl}/workflows?limit=1`

  if (!base || !apiKey) {
    return json({ success: false, error: "Missing env", missing: [!base && "N8N_API_BASE_URL", !apiKey && "N8N_API_KEY"].filter(Boolean) }, 500)
  }

  async function tryHeaders(name: string, headers: Record<string, string>) {
    try {
      const res = await fetch(url, { headers, cache: "no-store" })
      const text = await res.text()
      let body: any
      try { body = JSON.parse(text) } catch { body = text }
      return { name, status: res.status, ok: res.ok, body }
    } catch (e: any) {
      return { name, error: e?.message || String(e) }
    }
  }

  const attempts = await Promise.all([
    tryHeaders('x-only', { 'X-N8N-API-KEY': apiKey }),
    tryHeaders('auth-only', { 'Authorization': `Bearer ${apiKey}` }),
    tryHeaders('both', { 'X-N8N-API-KEY': apiKey, 'Authorization': `Bearer ${apiKey}` }),
    tryHeaders('x-lowercase', { 'x-n8n-api-key': apiKey }),
  ])

  // Try query param fallbacks if headers were rejected
  const qpAttempts = await Promise.all([
    tryHeaders('query-api_key', {}),
    tryHeaders('query-apiKey', {}),
  ].map((att, i) => att))

  // Re-run with query params included
  async function tryWithQuery(paramName: 'api_key' | 'apiKey') {
    const qUrl = `${baseUrl}/workflows?limit=1&${paramName}=${encodeURIComponent(apiKey)}`
    const res = await fetch(qUrl, { cache: 'no-store' })
    const text = await res.text()
    let body: any
    try { body = JSON.parse(text) } catch { body = text }
    return { name: `with-${paramName}`, status: res.status, ok: res.ok, body, endpoint: qUrl }
  }

  const qpResults = [] as any[]
  qpResults.push(await tryWithQuery('api_key'))
  qpResults.push(await tryWithQuery('apiKey'))

  const success = attempts.some(a => (a as any).ok) || qpResults.some(a => a.ok)
  return json({ success, endpoint: url, attempts, queryParamAttempts: qpResults })
}

import { NextResponse } from "next/server"

function json(data: any, status = 200) {
  return NextResponse.json(data, { status })
}

export async function GET() {
  const base = process.env.N8N_API_BASE_URL || ""
  const apiKey = process.env.N8N_API_KEY || ""
  const baseUrlRaw = base.endsWith("/") ? base.slice(0, -1) : base
  const baseUrl = baseUrlRaw.endsWith('/rest') ? baseUrlRaw.replace(/\/rest$/, '/api/v1') : baseUrlRaw

  if (!baseUrl || !apiKey) {
    return json({
      success: false,
      error: "Missing env vars",
      missing: [!baseUrl && "N8N_API_BASE_URL", !apiKey && "N8N_API_KEY"].filter(Boolean),
    }, 500)
  }

  // Some n8n versions / configurations may not expose /health; fall back to /workflows listing for connectivity test.
  const healthUrl = `${baseUrl}/health`
  const workflowsUrl = `${baseUrl}/workflows?limit=1`

  const headers = {
    "Content-Type": "application/json",
    "X-N8N-API-KEY": apiKey,
    "Authorization": `Bearer ${apiKey}`,
  }

  async function tryFetch(url: string) {
    const res = await fetch(url, { headers, cache: "no-store" })
    const text = await res.text()
    let body: any
    try { body = JSON.parse(text) } catch { body = text }
    return { res, body }
  }

  try {
    // First attempt /health
    const h = await tryFetch(healthUrl)
    if (h.res.ok) {
  return json({ success: true, endpoint: healthUrl, normalizedBase: baseUrl, body: h.body })
    }
    // If 404 specifically, retry with /workflows as a connectivity/auth check
    if (h.res.status === 404) {
      const w = await tryFetch(workflowsUrl)
      if (w.res.ok) {
  return json({ success: true, endpoint: workflowsUrl, normalizedBase: baseUrl, body: w.body, note: "Health endpoint missing; workflows reachable." })
      }
      return json({
        success: false,
        endpointTried: [healthUrl, workflowsUrl],
        healthStatus: h.res.status,
        workflowsStatus: w.res.status,
        hint: w.res.status === 401 ? "401: API key invalid / stripped by proxy" : "Check proxy or n8n config for /rest path",
        healthBody: h.body,
        workflowsBody: w.body,
      }, 500)
    }
    // Non-404 failure on /health
    return json({
      success: false,
      status: h.res.status,
      statusText: h.res.statusText,
      endpoint: healthUrl,
      body: h.body,
      hint: h.res.status === 401 ? "401: API key invalid or header stripped" : "If this is unexpected, verify n8n version and reverse proxy config.",
      normalizedBase: baseUrl,
    }, 500)
  } catch (e: any) {
    return json({ success: false, error: e?.message || String(e), tried: [healthUrl, workflowsUrl], normalizedBase: baseUrl }, 500)
  }
}

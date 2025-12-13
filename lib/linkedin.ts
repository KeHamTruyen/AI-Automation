import qs from "querystring"

const LINKEDIN_AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization"
const LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken"

export function buildLinkedInAuthUrl(params: {
  clientId: string
  redirectUri: string
  state: string
  scope?: string
}) {
  const scope = params.scope || "profile openid w_member_social"
  const query = qs.stringify({
    response_type: "code",
    client_id: params.clientId,
    redirect_uri: params.redirectUri,
    state: params.state,
    scope,
  })
  return `${LINKEDIN_AUTH_URL}?${query}`
}

export async function exchangeCodeForToken(args: {
  socialId: string
  code: string
  clientId: string
  clientSecret: string
  redirectUri?: string
}) {
  const redirectUri = args.redirectUri || `${process.env.NEXT_PUBLIC_APP_URL || ''}/api/auth/linkedin/callback`
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: args.code,
    redirect_uri: redirectUri,
    client_id: args.clientId,
    client_secret: args.clientSecret,
  })
  const res = await fetch(LINKEDIN_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(`LinkedIn token exchange failed: ${res.status} ${JSON.stringify(data)}`)
  }
  const accessToken = data.access_token as string
  const expiresIn = Number(data.expires_in || 0)
  const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000) : undefined
  return { accessToken, refreshToken: undefined, expiresAt }
}

export async function postLinkedInShare(accessToken: string, payload: any) {
  // Minimal placeholder to post content using LinkedIn API if needed
  // Use w_member_social with /ugcPosts endpoint.
  const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`LinkedIn post failed: ${res.status} ${JSON.stringify(data)}`)
  return data
}

import { NextResponse, type NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { prisma } from "@/lib/prisma"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

async function getUserId(request: NextRequest): Promise<string | null> {
  const cookieToken = request.cookies.get("auth-token")?.value
  const bearer = request.headers.get("authorization")?.replace("Bearer ", "")
  const token = cookieToken || bearer
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return String(payload.userId || "") || null
  } catch {
    return null
  }
}

function json(message: any, status = 200) {
  return NextResponse.json(message, { status })
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === "") {
      return json({ success: false, error: "DATABASE_URL chưa cấu hình" }, 500)
    }
    const userId = await getUserId(request)
    if (!userId) return json({ success: false, error: "Unauthorized" }, 401)

    const body = await request.json().catch(() => ({} as any))
    const url = new URL(request.url)
    const platformQ = (url.searchParams.get("platform") || body.platform || "twitter").toLowerCase()
    const socialAccountId = url.searchParams.get("socialAccountId") || body.socialAccountId || undefined

    const platform = platformQ === "x" ? "twitter" : platformQ

    // Find account either by id or by platform for this user
    const account = socialAccountId
      ? await prisma.socialAccount.findUnique({ where: { id: socialAccountId } })
      : await prisma.socialAccount.findFirst({ where: { userId, platform } })

    if (!account || account.userId !== userId) {
      return json({ success: false, error: "Không tìm thấy tài khoản để test" }, 404)
    }
    if (!(account as any).n8nWebhookUrl) {
      return json({ success: false, error: "Tài khoản chưa có webhook (cần provision)" }, 400)
    }

    const testPayload = {
      platform,
      content_text: body.content_text || `Test post from API at ${new Date().toISOString()}`,
      hashtags: body.hashtags || ["#test", "#aimarketing"],
      platforms: [platform],
      media: body.media || [],
    }

    const res = await fetch((account as any).n8nWebhookUrl as string, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testPayload),
    })

    let responseBody: any = null
    const txt = await res.text().catch(() => "")
    try { responseBody = JSON.parse(txt) } catch { responseBody = txt }

    return json({
      success: res.ok,
      status: res.status,
      statusText: res.statusText,
      data: responseBody,
      sent: testPayload,
      webhookUrl: (account as any).n8nWebhookUrl,
    }, res.ok ? 200 : 502)
  } catch (error: any) {
    console.error("[/api/integrations/n8n/test]", error?.message || error)
    return json({ success: false, error: error?.message || "Không thể test workflow" }, 500)
  }
}

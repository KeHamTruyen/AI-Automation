import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { prisma } from "@/lib/prisma"

// Auth helper (shared logic kept local to avoid circular imports)
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

// Map DB SocialAccount -> UI SocialAccount shape
function mapAccount(a: any) {
  // Derive UI status: connected if has workflow, pending if only credential, else pending/error
  const uiStatus: "connected" | "pending" | "error" = a.n8nWorkflowId
    ? "connected"
    : a.n8nCredentialId
      ? "pending"
      : "pending"
  return {
    id: a.id,
    platform: a.platform,
    name: a.name,
    username: a.username,
    followers: a.followers ?? 0,
    isActive: a.status !== "INACTIVE",
    status: uiStatus,
    lastSync: a.updatedAt?.toISOString?.() || new Date().toISOString(),
    engagement: 0, // Placeholder until analytics implemented
    posts: 0, // Placeholder until content count implemented
    avatar: "/placeholder-user.jpg",
    n8nWebhookUrl: a.n8nWebhookUrl || null,
  }
}

export async function GET(request: NextRequest) {
  try {
    // Ensure DB is configured
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === "") {
      return NextResponse.json({
        success: false,
        error: "DATABASE_URL chưa cấu hình",
      }, { status: 500 })
    }
    const userId = await getUserId(request)
    if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const platform = searchParams.get("platform") || undefined

    const accounts = await prisma.socialAccount.findMany({
      where: { userId, ...(platform ? { platform } : {}) },
      orderBy: { createdAt: "desc" },
    })

    const data = accounts.map(mapAccount)
    return NextResponse.json({ success: true, data, total: data.length })
  } catch (error: any) {
    console.error("[social-accounts GET]", error?.message || error)
    return NextResponse.json({ success: false, error: "Failed to fetch social accounts" }, { status: 500 })
  }
}

// Optional creation endpoint (non-provision). Provisioning should use /api/integrations/n8n/provision.
export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === "") {
      return NextResponse.json({ success: false, error: "DATABASE_URL chưa cấu hình" }, { status: 500 })
    }
    const userId = await getUserId(request)
    if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    const body = await request.json().catch(() => ({}))
    const { platform, name, username } = body as { platform?: string; name?: string; username?: string }
    if (!platform || !name || !username) {
      return NextResponse.json({ success: false, error: "Thiếu platform/name/username" }, { status: 400 })
    }
    const created = await prisma.socialAccount.create({ data: { userId, platform, name, username } })
    return NextResponse.json({ success: true, data: mapAccount(created) })
  } catch (error: any) {
    console.error("[social-accounts POST]", error?.message || error)
    return NextResponse.json({ success: false, error: "Failed to create social account" }, { status: 500 })
  }
}

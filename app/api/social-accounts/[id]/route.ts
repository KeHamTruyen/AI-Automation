import { type NextRequest, NextResponse } from "next/server"
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

function mapAccount(a: any) {
  const uiStatus: "connected" | "pending" | "error" = a.n8nWorkflowId ? "connected" : a.n8nCredentialId ? "pending" : "pending"
  return {
    id: a.id,
    platform: a.platform,
    name: a.name,
    username: a.username,
    followers: a.followers ?? 0,
    isActive: a.status !== "INACTIVE",
    status: uiStatus,
    lastSync: a.updatedAt?.toISOString?.() || new Date().toISOString(),
    engagement: 0,
    posts: 0,
    avatar: "/placeholder-user.jpg",
    n8nWebhookUrl: a.n8nWebhookUrl || null,
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === "") {
      return NextResponse.json({ success: false, error: "DATABASE_URL chưa cấu hình" }, { status: 500 })
    }
    const userId = await getUserId(request)
    if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    const account = await prisma.socialAccount.findUnique({ where: { id: params.id } })
    if (!account || account.userId !== userId) {
      return NextResponse.json({ success: false, error: "Không tìm thấy tài khoản" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: mapAccount(account) })
  } catch (error: any) {
    console.error("[social-accounts/:id GET]", error?.message || error)
    return NextResponse.json({ success: false, error: "Failed to fetch account" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === "") {
      return NextResponse.json({ success: false, error: "DATABASE_URL chưa cấu hình" }, { status: 500 })
    }
    const userId = await getUserId(request)
    if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    const existing = await prisma.socialAccount.findUnique({ where: { id: params.id } })
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ success: false, error: "Không tìm thấy tài khoản" }, { status: 404 })
    }
    const body = await request.json().catch(() => ({}))
    const { name, followers, status } = body as { name?: string; followers?: number; status?: string }
    const updated = await prisma.socialAccount.update({
      where: { id: params.id },
      data: {
        ...(name ? { name } : {}),
        ...(typeof followers === "number" ? { followers } : {}),
        ...(status ? { status } : {}),
      } as any,
    })
    return NextResponse.json({ success: true, data: mapAccount(updated), message: "Account updated successfully" })
  } catch (error: any) {
    console.error("[social-accounts/:id PUT]", error?.message || error)
    return NextResponse.json({ success: false, error: "Failed to update account" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === "") {
      return NextResponse.json({ success: false, error: "DATABASE_URL chưa cấu hình" }, { status: 500 })
    }
    const userId = await getUserId(request)
    if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    const existing = await prisma.socialAccount.findUnique({ where: { id: params.id } })
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ success: false, error: "Không tìm thấy tài khoản" }, { status: 404 })
    }
    // Prefer FE to call /api/integrations/n8n/provision?socialAccountId=... DELETE for n8n cleanup.
    await prisma.socialAccount.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true, message: "Account deleted" })
  } catch (error: any) {
    console.error("[social-accounts/:id DELETE]", error?.message || error)
    return NextResponse.json({ success: false, error: "Failed to delete account" }, { status: 500 })
  }
}

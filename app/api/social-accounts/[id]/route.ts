import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { prisma } from "@/lib/prisma"
import { deleteCredential, removePlatformAccountNode } from "@/lib/n8n"

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

    // Get user's workflow ID
    const user = await prisma.user.findUnique({ where: { id: userId } })
    
    // Clean up n8n resources
    try {
      // 1. Delete credential from n8n (if exists)
      if (existing.n8nCredentialId) {
        await deleteCredential(existing.n8nCredentialId)
        console.log(`✅ Deleted n8n credential: ${existing.n8nCredentialId}`)
      }

      // 2. Remove node from workflow (if workflow exists)
      if (user?.n8nWorkflowId && existing.n8nCredentialId) {
        await removePlatformAccountNode({
          workflowId: user.n8nWorkflowId,
          credentialId: existing.n8nCredentialId,
          platformHint: existing.platform.toLowerCase(),
          accountDisplayNameHint: existing.name
        })
        console.log(`✅ Removed ${existing.platform} node from workflow`)
      }
    } catch (n8nError: any) {
      // Log but don't block deletion if n8n cleanup fails
      console.error('⚠️ n8n cleanup error:', n8nError?.message || n8nError)
    }

    // 3. Delete from database
    await prisma.socialAccount.delete({ where: { id: params.id } })
    
    return NextResponse.json({ 
      success: true, 
      message: `${existing.platform} account deleted successfully` 
    })
  } catch (error: any) {
    console.error("[social-accounts/:id DELETE]", error?.message || error)
    return NextResponse.json({ success: false, error: "Failed to delete account" }, { status: 500 })
  }
}

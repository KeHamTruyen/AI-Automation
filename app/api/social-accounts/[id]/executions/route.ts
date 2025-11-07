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

    // Query last 10 executions
    const logs = await (prisma as any).executionLog.findMany({
      where: { socialAccountId: params.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    })

    return NextResponse.json({ success: true, data: logs })
  } catch (e: any) {
    console.error("[social-accounts/:id/executions GET]", e?.message || e)
    return NextResponse.json({ success: false, error: "Failed to fetch executions" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const authCookie = req.cookies.get("auth-token")?.value
    if (!authCookie) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    let userId: string
    try {
      const { payload } = await jwtVerify(authCookie, JWT_SECRET)
      userId = (payload as any)?.userId as string
      if (!userId) {
        return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
      }
    } catch (e) {
      return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status") || undefined
    const take = Math.min(Number(searchParams.get("take") || 50), 100)

    const where: any = {
      userId: userId  // Filter by current user
    }
    if (status) {
      where.status = status
    }

    const orderBy = status === 'PUBLISHED'
      ? [{ publishedAt: 'desc' as const }, { createdAt: 'desc' as const }]
      : [{ createdAt: 'desc' as const }]

    const items = await prisma.content.findMany({
      where,
      orderBy,
      take,
      select: {
        id: true,
        title: true,
        content: true,
        hashtags: true,
        platforms: true,
        media: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ success: true, data: items })
  } catch (err: any) {
    console.error("contents.GET error", err)
    return NextResponse.json({ success: false, error: "Failed to list contents" }, { status: 500 })
  }
}

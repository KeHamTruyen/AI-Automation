import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status") || undefined
    const take = Math.min(Number(searchParams.get("take") || 50), 100)

    const where: any = {}
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

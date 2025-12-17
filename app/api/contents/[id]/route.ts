import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const content = await prisma.content.findUnique({
      where: { id: params.id },
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

    if (!content) {
      return NextResponse.json(
        { success: false, error: "Content not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: content })
  } catch (err: any) {
    console.error("contents.[id].GET error", err)
    return NextResponse.json(
      { success: false, error: "Failed to get content" },
      { status: 500 }
    )
  }
}

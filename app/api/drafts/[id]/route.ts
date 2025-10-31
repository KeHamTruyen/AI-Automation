import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_URL is empty. Configure your database in .env first.",
        },
        { status: 503 },
      )
    }
    const draft = await prisma.content.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        content: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    if (!draft) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 })
    if (draft.status !== "DRAFT") return NextResponse.json({ success: false, error: "Not a draft" }, { status: 400 })
    return NextResponse.json({ success: true, data: draft })
  } catch (err) {
    console.error("drafts/:id GET error", err)
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_URL is empty. Configure your database in .env first.",
        },
        { status: 503 },
      )
    }
    const body = await req.json().catch(() => ({}))
    const content_text: string | undefined = body.content_text ?? body.content
    const title: string | undefined = body.title
    const hashtags: string[] | undefined = Array.isArray(body.hashtags)
      ? body.hashtags
      : typeof body.hashtags === "string"
      ? body.hashtags.split(/\s+/).filter((s: string) => s.startsWith("#"))
      : undefined
    const platforms: string[] | undefined = Array.isArray(body.platforms)
      ? body.platforms
      : body.platform
      ? [String(body.platform)]
      : undefined

    const updated = await prisma.content.update({
      where: { id: params.id },
      data: ({
        ...(title !== undefined ? { title } : {}),
        ...(content_text !== undefined ? { content: content_text } : {}),
        ...(hashtags !== undefined ? { hashtags } : {}),
        ...(platforms !== undefined ? { platforms } : {}),
      } as any),
      select: { id: true, updatedAt: true },
    })
    return NextResponse.json({ success: true, data: updated })
  } catch (err) {
    console.error("drafts/:id PATCH error", err)
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_URL is empty. Configure your database in .env first.",
        },
        { status: 503 },
      )
    }
    await prisma.content.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("drafts/:id DELETE error", err)
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 })
  }
}

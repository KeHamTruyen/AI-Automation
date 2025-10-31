import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

// Create draft or list drafts
export async function GET(req: NextRequest) {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_URL is empty. Configure your database in .env first.",
          hint:
            'Set DATABASE_URL in .env (e.g., postgresql://user:pass@localhost:5432/ai_marketing_engine) and run: prisma generate && prisma db push',
        },
        { status: 503 },
      )
    }
    const { searchParams } = new URL(req.url)
    const take = Math.min(Number(searchParams.get("take") || 20), 100)
    const cursor = searchParams.get("cursor") || undefined
    const q = searchParams.get("q")?.trim()

    const where: any = { status: "DRAFT" }
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
      ]
    }

    const items = await prisma.content.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: take + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    let nextCursor: string | undefined = undefined
    if (items.length > take) {
      const next = items.pop()!
      nextCursor = next.id
    }

    return NextResponse.json({ success: true, data: { items, nextCursor } })
  } catch (err: any) {
    console.error("drafts.GET error", err)
    return NextResponse.json({ success: false, error: "Failed to list drafts" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_URL is empty. Configure your database in .env first.",
          hint:
            'Set DATABASE_URL in .env (e.g., postgresql://user:pass@localhost:5432/ai_marketing_engine) and run: prisma generate && prisma db push',
        },
        { status: 503 },
      )
    }
    const body = await req.json().catch(() => ({}))
    const title: string = body.title?.toString() || ""
    const content_text: string = body.content_text?.toString() || body.content?.toString() || ""
    const hashtags: string[] = Array.isArray(body.hashtags)
      ? body.hashtags
      : typeof body.hashtags === "string"
      ? body.hashtags.split(/\s+/).filter((s: string) => s.startsWith("#"))
      : []
    const platforms: string[] = Array.isArray(body.platforms)
      ? body.platforms
      : body.platform
      ? [String(body.platform)]
      : []
    const userId: string | undefined = body.userId ? String(body.userId) : undefined

    if (!content_text.trim()) {
      return NextResponse.json({ success: false, error: "Missing content_text" }, { status: 400 })
    }

    // Ensure required user relation: connect provided userId or use a default system user
    const systemEmail = process.env.SYSTEM_USER_EMAIL?.trim() || "system@local"
    const systemPassword = crypto.randomBytes(24).toString("hex")
    const userRelation = userId
      ? { connect: { id: userId } }
      : {
          connectOrCreate: {
            where: { email: systemEmail },
            create: {
              email: systemEmail,
              name: "System",
              password: systemPassword,
              role: "USER",
            },
          },
        }

    const draft = await prisma.content.create({
      data: ({
        title: title || (content_text.slice(0, 50) + (content_text.length > 50 ? "…" : "")),
        content: content_text,
        // The following fields require DB migration; casting to any keeps build passing until prisma generate
        hashtags,
        platforms,
        type: "POST",
        status: "DRAFT",
        user: userRelation as any,
      } as any),
      select: { id: true },
    })

    return NextResponse.json({ success: true, data: { id: draft.id } }, { status: 201 })
  } catch (err) {
    console.error("drafts.POST error", err)
    return NextResponse.json({ success: false, error: "Failed to create draft" }, { status: 500 })
  }
}

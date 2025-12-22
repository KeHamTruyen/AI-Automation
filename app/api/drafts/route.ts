import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { jwtVerify } from "jose"
import crypto from "crypto"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

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
    const take = Math.min(Number(searchParams.get("take") || 20), 100)
    const cursor = searchParams.get("cursor") || undefined
    const q = searchParams.get("q")?.trim()

    const where: any = { 
      status: "DRAFT",
      userId: userId  // Filter by current user
    }
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
    const media: string[] = Array.isArray(body.media) ? body.media : []

    const draftId = crypto.randomBytes(16).toString("hex")
    const newDraft = await prisma.content.create({
      data: {
        id: draftId,
        title: title || "Untitled Draft",
        content: content_text,
        hashtags,
        platforms,
        type: "POST",
        status: "DRAFT",
        media,
        userId: userId,  // Use authenticated userId
      },
    })

    return NextResponse.json({ success: true, data: newDraft })
  } catch (err: any) {
    console.error("drafts.POST error", err)
    return NextResponse.json({ success: false, error: "Failed to create draft" }, { status: 500 })
  }
}
}

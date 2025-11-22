import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Fallback publication status
const PUBL = { PENDING: 'PENDING' } as const

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { content_id, social_account_ids, scheduled_at, caption_override, media_override } = data as {
      content_id: string
      social_account_ids: string[]
      scheduled_at?: string
      caption_override?: string
      media_override?: string[]
    }
    if (!content_id || !Array.isArray(social_account_ids) || !social_account_ids.length) {
      return NextResponse.json({ success: false, error: 'Missing content_id or social_account_ids' }, { status: 400 })
    }
    const content = await prisma.content.findUnique({ where: { id: content_id } })
    if (!content) return NextResponse.json({ success: false, error: 'Content not found' }, { status: 404 })

    const when = scheduled_at ? new Date(scheduled_at) : null
    if (scheduled_at && isNaN(when!.getTime())) {
      return NextResponse.json({ success: false, error: 'Invalid scheduled_at' }, { status: 400 })
    }

    // Create publications (skip existing unique pairs)
    const created: any[] = []
    for (const saId of social_account_ids) {
      const existing = await prisma.contentPublication.findUnique({ where: { contentId_socialAccountId: { contentId: content_id, socialAccountId: saId } } })
      if (existing) { created.push(existing); continue }
      const pub = await prisma.contentPublication.create({
        data: {
          contentId: content_id,
          socialAccountId: saId,
          status: PUBL.PENDING as any,
          scheduledAt: when,
          captionOverride: caption_override || null,
          mediaOverride: media_override || []
        }
      })
      created.push(pub)
    }

    return NextResponse.json({ success: true, publications: created })
  } catch (e: any) {
    console.error('[publications.schedule]', e)
    return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const contentId = url.searchParams.get('contentId')
    const saId = url.searchParams.get('socialAccountId')
    const where: any = {}
    if (contentId) where.contentId = contentId
    if (saId) where.socialAccountId = saId
    const pubs = await prisma.contentPublication.findMany({ where, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ success: true, publications: pubs })
  } catch (e: any) {
    console.error('[publications.list]', e)
    return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 })
  }
}
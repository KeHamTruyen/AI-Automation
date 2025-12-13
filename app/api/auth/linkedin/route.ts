import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { buildLinkedInAuthUrl } from "@/lib/linkedin"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const socialId = searchParams.get("socialId") || undefined
    if (!socialId) return NextResponse.json({ success: false, error: "Thiếu socialId" }, { status: 400 })

    const social = await prisma.socialAccount.findUnique({ where: { id: socialId } })
    if (!social) return NextResponse.json({ success: false, error: "Không tìm thấy social account" }, { status: 404 })

    const clientId = (social as any)?.clientId || process.env.LINKEDIN_CLIENT_ID
    const clientSecret = (social as any)?.clientSecret || process.env.LINKEDIN_CLIENT_SECRET
    if (!clientId || !clientSecret) {
      return NextResponse.json({ success: false, error: "Thiếu clientId/clientSecret cho LinkedIn" }, { status: 500 })
    }

    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || ''}/api/auth/linkedin/callback`
    const authUrl = buildLinkedInAuthUrl({ clientId, redirectUri, state: socialId })
    return NextResponse.redirect(authUrl)
  } catch (err: any) {
    console.error("linkedin/start error", err)
    return NextResponse.json({ success: false, error: "Không thể khởi tạo OAuth LinkedIn" }, { status: 500 })
  }
}

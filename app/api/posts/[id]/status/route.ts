import { NextRequest, NextResponse } from "next/server"

// n8n callback endpoint: updates status/logs for a given post target
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY
    const auth = req.headers.get("x-internal-api-key")
    if (!INTERNAL_API_KEY || auth !== INTERNAL_API_KEY) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const postId = params.id
    const body = await req.json()

    // TODO: persist to DB (logs, status). For now, console log.
    console.log("Callback from n8n for post:", postId, "payload:", body)

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to accept callback" }, { status: 500 })
  }
}

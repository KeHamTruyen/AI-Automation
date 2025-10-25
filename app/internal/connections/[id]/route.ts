import { NextRequest, NextResponse } from "next/server"

// n8n will call this to fetch a provider token by connection_id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY
    const auth = req.headers.get("x-internal-api-key")
    if (!INTERNAL_API_KEY || auth !== INTERNAL_API_KEY) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // TODO: fetch from DB. For now, return mock token per provider.
    // You can use the "id" pattern to choose provider in tests, e.g., conn_fb, conn_ig, conn_li, conn_tw
    const mockProvider = id.includes("fb")
      ? "facebook_page"
      : id.includes("ig")
      ? "instagram"
      : id.includes("li")
      ? "linkedin"
      : id.includes("tw")
      ? "twitter"
      : "facebook_page"

    return NextResponse.json({
      success: true,
      data: {
        connection_id: id,
        provider: mockProvider,
        access_token: "MOCK_ACCESS_TOKEN",
        expiry: null,
        meta: { note: "Mock connection. Replace with DB lookup." },
      },
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to fetch connection" }, { status: 500 })
  }
}

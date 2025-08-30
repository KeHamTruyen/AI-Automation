import { type NextRequest, NextResponse } from "next/server"

// POST - Đăng xuất
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Đăng xuất thành công",
    })

    // Xóa auth cookie
    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    })

    return response
  } catch (error) {
    return NextResponse.json({ success: false, error: "Lỗi khi đăng xuất" }, { status: 500 })
  }
}

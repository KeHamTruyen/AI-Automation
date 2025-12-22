import { NextResponse, type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { SignJWT } from "jose"
import bcrypt from "bcryptjs"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

// POST - Đăng ký tài khoản mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { email, password, name } = body as { email?: string; password?: string; name?: string }

    if (!email || !password || !name) {
      return NextResponse.json({ success: false, error: "Email, tên và mật khẩu là bắt buộc" }, { status: 400 })
    }

    // Nếu chưa cấu hình DB thì không thể đăng ký thật
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { success: false, error: "DATABASE_URL chưa được cấu hình - không thể đăng ký" },
        { status: 500 },
      )
    }

    // Kiểm tra trùng email
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ success: false, error: "Email đã tồn tại" }, { status: 409 })
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10)

    // Tạo user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashed,
        role: "USER",
      },
    })

    // Ký JWT và set cookie để đăng nhập ngay sau khi đăng ký
    const token = await new SignJWT({ userId: user.id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET)

    const { password: _pw, ...safeUser } = user
    const response = NextResponse.json({
      success: true,
      data: {
        user: { ...safeUser, role: String(user.role).toLowerCase() },
        token,
        redirectUrl: "/dashboard",
      },
      message: "Đăng ký thành công",
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ success: false, error: "Lỗi server khi đăng ký" }, { status: 500 })
  }
}

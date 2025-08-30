import { type NextRequest, NextResponse } from "next/server"
import { SignJWT } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  createdAt: string
  lastLogin?: string
}

// Mock users database
const users: (User & { password: string })[] = [
  {
    id: "1",
    email: "admin@company.com",
    name: "Admin User",
    password: "admin123", // Trong thực tế sẽ hash password
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    email: "user@company.com",
    name: "Regular User",
    password: "user123",
    role: "user",
    createdAt: "2024-01-02T00:00:00Z",
    lastLogin: "2024-01-14T15:20:00Z",
  },
]

// POST - Đăng nhập
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email và password là bắt buộc" }, { status: 400 })
    }

    // Tìm user
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ success: false, error: "Email hoặc password không đúng" }, { status: 401 })
    }

    // Tạo JWT token
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET)

    // Cập nhật last login
    const userIndex = users.findIndex((u) => u.id === user.id)
    if (userIndex !== -1) {
      users[userIndex].lastLogin = new Date().toISOString()
    }

    // Loại bỏ password khỏi response
    const { password: _, ...safeUser } = user

    const response = NextResponse.json({
      success: true,
      data: {
        user: safeUser,
        token,
      },
      message: "Đăng nhập thành công",
    })

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
    })

    return response
  } catch (error) {
    return NextResponse.json({ success: false, error: "Lỗi server khi đăng nhập" }, { status: 500 })
  }
}

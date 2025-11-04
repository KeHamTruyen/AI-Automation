import { type NextRequest, NextResponse } from "next/server"
import { SignJWT } from "jose"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

// POST - Đăng nhập
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email và password là bắt buộc" }, { status: 400 })
    }

    // Check if database is configured
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl || databaseUrl === "") {
      console.log("🔄 Database not configured, using mock data")
      return handleMockLogin(email, password)
    }

    try {
      // Tìm user trong database
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        return NextResponse.json({ success: false, error: "Email hoặc password không đúng" }, { status: 401 })
      }

      // Kiểm tra password: hỗ trợ cả hashed (bcrypt) và nâng cấp từ plain-text nếu gặp dữ liệu cũ
      let isPasswordValid = false
      const storedPassword = user.password || ""
      const looksHashed = storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$")
      if (looksHashed) {
        isPasswordValid = await bcrypt.compare(password, storedPassword)
      } else {
        // Plain-text legacy mode
        isPasswordValid = password === storedPassword
        if (isPasswordValid) {
          // Nâng cấp lên bcrypt để bảo mật tốt hơn (best-effort, không chặn đăng nhập nếu lỗi hash)
          try {
            const hashed = await bcrypt.hash(password, 10)
            await prisma.user.update({ where: { id: user.id }, data: { password: hashed } })
          } catch (e) {
            console.warn("Password upgrade to bcrypt failed:", e)
          }
        }
      }

      if (!isPasswordValid) {
        return NextResponse.json({ success: false, error: "Email hoặc password không đúng" }, { status: 401 })
      }

      // Cảnh báo nếu thiếu JWT_SECRET trong production
      if (
        process.env.NODE_ENV === "production" && (!process.env.JWT_SECRET || process.env.JWT_SECRET === "your-secret-key")
      ) {
        console.warn("[Auth] Weak or missing JWT_SECRET in production environment.")
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
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      })

      // Loại bỏ password khỏi response
      const { password: _, ...safeUser } = user

      const response = NextResponse.json({
        success: true,
        data: {
          user: {
            ...safeUser,
            role: user.role.toLowerCase(),
          },
          token,
          redirectUrl: "/dashboard", // Add redirect URL
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
    } catch (dbError) {
      console.error("🔴 Database connection failed:", dbError instanceof Error ? dbError.message : dbError)
      console.log("🔄 Falling back to mock data...")
      // Fallback to mock data if database is not available
      return handleMockLogin(email, password)
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Lỗi server khi đăng nhập" }, { status: 500 })
  }
}

// Fallback mock login function
async function handleMockLogin(email: string, password: string) {
  const mockUsers = [
    {
      id: "1",
      email: "admin@company.com",
      name: "Admin User",
      password: "admin123",
      role: "ADMIN",
      createdAt: new Date("2024-01-01T00:00:00Z"),
      lastLogin: new Date("2024-01-15T10:30:00Z"),
    },
    {
      id: "2",
      email: "user@company.com",
      name: "Regular User",
      password: "user123",
      role: "USER",
      createdAt: new Date("2024-01-02T00:00:00Z"),
      lastLogin: new Date("2024-01-14T15:20:00Z"),
    },
  ]

  const user = mockUsers.find((u) => u.email === email && u.password === password)

  if (!user) {
    return NextResponse.json({ success: false, error: "Email hoặc password không đúng" }, { status: 401 })
  }

  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET)

  const { password: _, ...safeUser } = user

  const response = NextResponse.json({
    success: true,
    data: {
      user: {
        ...safeUser,
        role: user.role.toLowerCase(),
      },
      token,
      redirectUrl: "/dashboard",
    },
    message: "Đăng nhập thành công (Mock)",
  })

  response.cookies.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60,
  })

  return response
}

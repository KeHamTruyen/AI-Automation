import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

// Mock users database
const users = [
  {
    id: "1",
    email: "admin@company.com",
    name: "Admin User",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    email: "user@company.com",
    name: "Regular User",
    role: "user",
    createdAt: "2024-01-02T00:00:00Z",
    lastLogin: "2024-01-14T15:20:00Z",
  },
]

// GET - Lấy thông tin user hiện tại
export async function GET(request: NextRequest) {
  try {
    const token =
      request.cookies.get("auth-token")?.value || request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ success: false, error: "Token không tồn tại" }, { status: 401 })
    }

    // Verify JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userId = payload.userId as string

    // Tìm user
    const user = users.find((u) => u.id === userId)

    if (!user) {
      return NextResponse.json({ success: false, error: "User không tồn tại" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Token không hợp lệ" }, { status: 401 })
  }
}

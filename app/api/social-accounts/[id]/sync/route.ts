import { type NextRequest, NextResponse } from "next/server"

// Mock database
const socialAccounts = [
  {
    id: "1",
    platform: "facebook",
    name: "Công ty ABC",
    username: "@congtyabc",
    followers: 15420,
    isActive: true,
    status: "connected",
    lastSync: "2024-01-15T10:30:00Z",
    engagement: 85,
    posts: 142,
    avatar: "/placeholder-user.jpg",
    accessToken: "encrypted_token_here",
  },
]

// POST - Đồng bộ dữ liệu từ nền tảng
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const accountIndex = socialAccounts.findIndex((acc) => acc.id === params.id)

    if (accountIndex === -1) {
      return NextResponse.json({ success: false, error: "Không tìm thấy tài khoản" }, { status: 404 })
    }

    const account = socialAccounts[accountIndex]

    // Simulate API call to social platform
    // Trong thực tế sẽ gọi API của Facebook, Instagram, etc.
    const mockSyncData = {
      followers: account.followers + Math.floor(Math.random() * 100) - 50,
      posts: account.posts + Math.floor(Math.random() * 5),
      engagement: Math.min(100, Math.max(0, account.engagement + Math.floor(Math.random() * 20) - 10)),
      status: "connected" as const,
      lastSync: new Date().toISOString(),
    }

    // Cập nhật dữ liệu
    socialAccounts[accountIndex] = {
      ...account,
      ...mockSyncData,
    }

    const { accessToken, ...safeAccount } = socialAccounts[accountIndex]

    return NextResponse.json({
      success: true,
      data: safeAccount,
      message: "Đồng bộ dữ liệu thành công",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Lỗi khi đồng bộ dữ liệu" }, { status: 500 })
  }
}

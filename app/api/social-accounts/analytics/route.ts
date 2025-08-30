import { type NextRequest, NextResponse } from "next/server"

// Mock database - trong thực tế sẽ kết nối với database thật
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
  },
  {
    id: "2",
    platform: "instagram",
    name: "ABC Company",
    username: "@abc_company",
    followers: 8750,
    isActive: true,
    status: "connected",
    lastSync: "2024-01-15T09:15:00Z",
    engagement: 92,
    posts: 89,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "3",
    platform: "twitter",
    name: "ABC Corp",
    username: "@abccorp",
    followers: 5230,
    isActive: false,
    status: "error",
    lastSync: "2024-01-14T16:45:00Z",
    engagement: 67,
    posts: 234,
    avatar: "/placeholder-user.jpg",
  },
]

const mockAnalyticsData = {
  overview: {
    totalAccounts: 3,
    activeAccounts: 2,
    totalFollowers: 29400,
    totalPosts: 465,
    avgEngagement: 81.3,
    growthRate: 12.5,
  },
  byPlatform: [
    {
      platform: "facebook",
      accounts: 1,
      followers: 15420,
      posts: 142,
      engagement: 85,
      growth: 8.2,
    },
    {
      platform: "instagram",
      accounts: 1,
      followers: 8750,
      posts: 89,
      engagement: 92,
      growth: 15.7,
    },
    {
      platform: "twitter",
      accounts: 1,
      followers: 5230,
      posts: 234,
      engagement: 67,
      growth: -2.1,
    },
  ],
  timeline: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    followers: Math.floor(Math.random() * 1000) + 28000,
    engagement: Math.floor(Math.random() * 20) + 70,
    posts: Math.floor(Math.random() * 10) + 5,
  })),
  topPosts: [
    {
      id: "1",
      platform: "instagram",
      content: "Sản phẩm mới ra mắt với nhiều tính năng hấp dẫn! #newproduct #innovation",
      likes: 1250,
      comments: 89,
      shares: 156,
      engagement: 94.2,
      publishedAt: "2024-01-14T10:30:00Z",
    },
    {
      id: "2",
      platform: "facebook",
      content: "Cảm ơn khách hàng đã tin tưởng và ủng hộ chúng tôi trong suốt thời gian qua!",
      likes: 890,
      comments: 67,
      shares: 234,
      engagement: 87.5,
      publishedAt: "2024-01-13T15:45:00Z",
    },
    {
      id: "3",
      platform: "twitter",
      content: "Tips marketing hiệu quả cho doanh nghiệp nhỏ. Thread 🧵",
      likes: 456,
      comments: 123,
      shares: 89,
      engagement: 78.9,
      publishedAt: "2024-01-12T09:20:00Z",
    },
  ],
}

// GET - Lấy dữ liệu analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "30d"
    const accountId = searchParams.get("accountId")

    let analyticsData = { ...mockAnalyticsData }

    // Lọc theo tài khoản cụ thể
    if (accountId) {
      const account = socialAccounts.find((acc) => acc.id === accountId)
      if (!account) {
        return NextResponse.json({ success: false, error: "Không tìm thấy tài khoản" }, { status: 404 })
      }

      // Tạo analytics data cho tài khoản cụ thể
      analyticsData = {
        overview: {
          totalAccounts: 1,
          activeAccounts: account.isActive ? 1 : 0,
          totalFollowers: account.followers,
          totalPosts: account.posts,
          avgEngagement: account.engagement,
          growthRate: Math.floor(Math.random() * 20) - 5,
        },
        byPlatform: [
          {
            platform: account.platform,
            accounts: 1,
            followers: account.followers,
            posts: account.posts,
            engagement: account.engagement,
            growth: Math.floor(Math.random() * 20) - 5,
          },
        ],
        timeline: analyticsData.timeline,
        topPosts: analyticsData.topPosts.filter((post) => post.platform === account.platform),
      }
    }

    // Điều chỉnh dữ liệu theo period
    if (period === "7d") {
      analyticsData.timeline = analyticsData.timeline.slice(-7)
    } else if (period === "90d") {
      // Mở rộng timeline cho 90 ngày
      analyticsData.timeline = Array.from({ length: 90 }, (_, i) => ({
        date: new Date(Date.now() - (89 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        followers: Math.floor(Math.random() * 2000) + 27000,
        engagement: Math.floor(Math.random() * 30) + 60,
        posts: Math.floor(Math.random() * 15) + 3,
      }))
    }

    return NextResponse.json({
      success: true,
      data: analyticsData,
      period,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Lỗi khi lấy dữ liệu analytics" }, { status: 500 })
  }
}

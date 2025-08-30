import { type NextRequest, NextResponse } from "next/server"

interface ScheduledPost {
  id: string
  content: string
  platforms: string[]
  scheduledTime: string
  status: "pending" | "published" | "failed"
  createdAt: string
  mediaUrls?: string[]
  hashtags?: string[]
}

// Mock database
const scheduledPosts: ScheduledPost[] = [
  {
    id: "1",
    content: "Sản phẩm mới ra mắt với nhiều tính năng hấp dẫn! #newproduct #innovation",
    platforms: ["facebook", "instagram"],
    scheduledTime: "2024-01-16T09:00:00Z",
    status: "pending",
    createdAt: "2024-01-15T14:30:00Z",
    hashtags: ["newproduct", "innovation"],
  },
]

// GET - Lấy danh sách bài đăng đã lên lịch
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const platform = searchParams.get("platform")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let filteredPosts = [...scheduledPosts]

    // Lọc theo status
    if (status) {
      filteredPosts = filteredPosts.filter((post) => post.status === status)
    }

    // Lọc theo platform
    if (platform) {
      filteredPosts = filteredPosts.filter((post) => post.platforms.includes(platform))
    }

    // Sắp xếp theo thời gian lên lịch
    filteredPosts.sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())

    // Phân trang
    const paginatedPosts = filteredPosts.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedPosts,
      total: filteredPosts.length,
      limit,
      offset,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Lỗi khi lấy danh sách bài đăng" }, { status: 500 })
  }
}

// POST - Lên lịch bài đăng mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, platforms, scheduledTime, mediaUrls, hashtags } = body

    // Validate required fields
    if (!content || !platforms || !scheduledTime) {
      return NextResponse.json({ success: false, error: "Thiếu thông tin bắt buộc" }, { status: 400 })
    }

    // Validate scheduled time (không được trong quá khứ)
    const scheduledDate = new Date(scheduledTime)
    if (scheduledDate <= new Date()) {
      return NextResponse.json({ success: false, error: "Thời gian lên lịch phải trong tương lai" }, { status: 400 })
    }

    // Tạo bài đăng mới
    const newPost: ScheduledPost = {
      id: Date.now().toString(),
      content,
      platforms,
      scheduledTime,
      status: "pending",
      createdAt: new Date().toISOString(),
      mediaUrls,
      hashtags,
    }

    scheduledPosts.push(newPost)

    return NextResponse.json(
      {
        success: true,
        data: newPost,
        message: "Lên lịch bài đăng thành công",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: "Lỗi khi lên lịch bài đăng" }, { status: 500 })
  }
}

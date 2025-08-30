import { type NextRequest, NextResponse } from "next/server"

// Mock data for development
const mockAccounts = [
  {
    id: "1",
    platform: "facebook",
    name: "My Business Page",
    username: "@mybusiness",
    followers: 15420,
    isActive: true,
    status: "connected",
    lastSync: new Date().toISOString(),
    engagement: 4.2,
    posts: 156,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "2",
    platform: "instagram",
    name: "Brand Instagram",
    username: "@brandname",
    followers: 8930,
    isActive: true,
    status: "connected",
    lastSync: new Date().toISOString(),
    engagement: 6.8,
    posts: 89,
    avatar: "/placeholder-user.jpg",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get("platform")
    const status = searchParams.get("status")

    let filteredAccounts = mockAccounts

    if (platform) {
      filteredAccounts = filteredAccounts.filter((account) => account.platform === platform)
    }

    if (status) {
      filteredAccounts = filteredAccounts.filter((account) => account.status === status)
    }

    return NextResponse.json({
      success: true,
      data: filteredAccounts,
      total: filteredAccounts.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch social accounts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { platform, name, username, accessToken } = body

    // Validate required fields
    if (!platform || !name || !username || !accessToken) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Create new account (mock)
    const newAccount = {
      id: Date.now().toString(),
      platform,
      name,
      username,
      followers: Math.floor(Math.random() * 10000),
      isActive: true,
      status: "connected",
      lastSync: new Date().toISOString(),
      engagement: Math.round(Math.random() * 10 * 100) / 100,
      posts: Math.floor(Math.random() * 100),
      avatar: "/placeholder-user.jpg",
    }

    mockAccounts.push(newAccount)

    return NextResponse.json({
      success: true,
      data: newAccount,
      message: "Social account added successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to add social account" }, { status: 500 })
  }
}

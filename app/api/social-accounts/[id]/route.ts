import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Mock account data
    const account = {
      id,
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
      settings: {
        autoPost: true,
        notifications: true,
        analytics: true,
      },
      permissions: ["read", "write", "manage"],
    }

    return NextResponse.json({
      success: true,
      data: account,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch account" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    // Mock update
    const updatedAccount = {
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: updatedAccount,
      message: "Account updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update account" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Mock deletion
    return NextResponse.json({
      success: true,
      message: "Account deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete account" }, { status: 500 })
  }
}

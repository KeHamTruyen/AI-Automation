import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "secret");

/**
 * DELETE /api/schedule/[id]
 * Delete a scheduled post
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authCookie = req.cookies.get("auth-token")?.value;
    if (!authCookie) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(authCookie, JWT_SECRET);
    const userId = payload.userId as string;

    const scheduledPost = await prisma.scheduledPost.findUnique({
      where: { id: params.id },
    });

    if (!scheduledPost) {
      return NextResponse.json(
        { success: false, error: "Scheduled post not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (scheduledPost.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // Only allow deletion if status is PENDING or ERROR
    if (!["PENDING", "ERROR"].includes(scheduledPost.status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete post with status: " + scheduledPost.status,
        },
        { status: 400 }
      );
    }

    await prisma.scheduledPost.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[DELETE /api/schedule/[id]]", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/schedule/[id]
 * Update scheduled time for a post
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authCookie = req.cookies.get("auth-token")?.value;
    if (!authCookie) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(authCookie, JWT_SECRET);
    const userId = payload.userId as string;

    const body = await req.json();
    const { scheduled_at } = body;

    if (!scheduled_at) {
      return NextResponse.json(
        { success: false, error: "scheduled_at is required" },
        { status: 400 }
      );
    }

    const scheduledPost = await prisma.scheduledPost.findUnique({
      where: { id: params.id },
    });

    if (!scheduledPost) {
      return NextResponse.json(
        { success: false, error: "Scheduled post not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (scheduledPost.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // Only allow update if status is PENDING or ERROR
    if (!["PENDING", "ERROR"].includes(scheduledPost.status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot update post with status: " + scheduledPost.status,
        },
        { status: 400 }
      );
    }

    const newScheduledAt = new Date(scheduled_at);
    if (newScheduledAt <= new Date()) {
      return NextResponse.json(
        { success: false, error: "Scheduled time must be in the future" },
        { status: 400 }
      );
    }

    const updated = await prisma.scheduledPost.update({
      where: { id: params.id },
      data: {
        scheduledAt: newScheduledAt,
        status: "PENDING", // Reset to PENDING if was ERROR
        attemptCount: 0, // Reset attempts
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    console.error("[PATCH /api/schedule/[id]]", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

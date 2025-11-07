import { NextResponse, type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

function authOk(req: NextRequest): boolean {
  const key = process.env.INTERNAL_API_KEY || ""
  if (!key) return false
  const header = req.headers.get("x-internal-api-key") || ""
  const bearer = req.headers.get("authorization")?.replace("Bearer ", "") || ""
  const query = new URL(req.url).searchParams.get("key") || ""
  return [header, bearer, query].some((v) => v === key)
}

export async function POST(req: NextRequest) {
  try {
    if (!authOk(req)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === "") {
      return NextResponse.json({ success: false, error: "DATABASE_URL chưa cấu hình" }, { status: 500 })
    }

    const body = await req.json().catch(() => ({}))
    const {
      socialAccountId,
      n8nWorkflowId,
      n8nExecutionId,
      status,
      request,
      response,
      errorMessage,
    } = body as {
      socialAccountId?: string
      n8nWorkflowId?: string
      n8nExecutionId?: string
      status?: "SUCCESS" | "FAIL"
      request?: any
      response?: any
      errorMessage?: string
    }

    let targetId = socialAccountId || ""
    if (!targetId && n8nWorkflowId) {
      const acc = await prisma.socialAccount.findFirst({ where: { n8nWorkflowId } as any })
      if (acc) targetId = acc.id
    }
    if (!targetId) {
      return NextResponse.json({ success: false, error: "Missing socialAccountId or n8nWorkflowId" }, { status: 400 })
    }

    // Insert execution log (cast prisma to any to avoid type issues until prisma generate is run)
    const created = await (prisma as any).executionLog.create({
      data: {
        socialAccountId: targetId,
        workflowId: n8nWorkflowId || null,
        executionId: n8nExecutionId || null,
        status: status === "FAIL" ? "FAIL" : "SUCCESS",
        request: request ?? null,
        response: response ?? null,
        errorMessage: errorMessage ?? null,
      },
    })

    return NextResponse.json({ success: true, data: { id: created.id } })
  } catch (e: any) {
    console.error("[n8n execution-callback]", e?.message || e)
    return NextResponse.json({ success: false, error: "Failed to record execution" }, { status: 500 })
  }
}

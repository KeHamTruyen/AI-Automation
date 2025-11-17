import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { jwtVerify } from "jose"
import { createFacebookTokenCredential, createWorkflowFromTemplateWithAccounts, deleteWorkflow } from "@/lib/n8n"

export async function POST(req: NextRequest) {
  try {
    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
    const templateId = process.env.N8N_TEMPLATE_WORKFLOW_ID
    if (!templateId) {
      return NextResponse.json({ success: false, error: "Missing N8N_TEMPLATE_WORKFLOW_ID" }, { status: 500 })
    }

    const body = await req.json().catch(() => ({}))
    const accessToken: string | undefined = body.accessToken
    const displayName: string = body.displayName || "Facebook"

    if (!accessToken) {
      return NextResponse.json({ success: false, error: "accessToken is required" }, { status: 400 })
    }

    let userId: string | null = null
    try {
      const authCookie = req.cookies.get("auth-token")?.value
      if (authCookie) {
        const { payload } = await jwtVerify(authCookie, JWT_SECRET)
        userId = (payload as any)?.userId || null
      }
    } catch {
      // ignore
    }
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Upsert SocialAccount row for Facebook
    const existingAccounts = await prisma.socialAccount.findMany({ where: { userId, platform: "facebook" } })
    let social = existingAccounts[0] || null

    // Create a fresh credential in n8n from access token
    const cred = await createFacebookTokenCredential(`fb-${userId}-${Date.now()}`, accessToken)

    if (!social) {
      social = await prisma.socialAccount.create({
        data: {
          userId,
          platform: "facebook",
          name: displayName,
          username: null,
          accessToken,
          n8nCredentialId: cred.id,
          n8nCredentialName: cred.name,
        } as any,
      })
    } else {
      social = await prisma.socialAccount.update({
        where: { id: social.id },
        data: {
          accessToken,
          n8nCredentialId: cred.id,
          n8nCredentialName: cred.name,
        } as any,
      })
    }

    // Ensure a per-user workflow exists; recreate from template and bind native FB credential
    const user = await prisma.user.findUnique({ where: { id: userId } })
    const oldWorkflowId = user?.n8nWorkflowId || null

    const { workflow, webhookUrl } = await createWorkflowFromTemplateWithAccounts({
      templateId,
      userId,
      accounts: [
        {
          platform: "facebook",
          accountDisplayName: displayName,
          credentialId: cred.id,
          credentialName: cred.name,
          credentialType: "facebookGraphApi",
        },
      ],
    })

    await prisma.user.update({ where: { id: userId }, data: { n8nWorkflowId: workflow.id, n8nWorkflowName: workflow.name, n8nWebhookUrl: webhookUrl || null } })
    await prisma.socialAccount.update({ where: { id: social.id }, data: { n8nWorkflowId: workflow.id, n8nWorkflowName: workflow.name, n8nWebhookUrl: webhookUrl || null } as any })

    if (oldWorkflowId && oldWorkflowId !== workflow.id) {
      try { await deleteWorkflow(oldWorkflowId) } catch { /* ignore */ }
    }

    return NextResponse.json({ success: true, workflowId: workflow.id, webhookUrl })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Failed" }, { status: 500 })
  }
}

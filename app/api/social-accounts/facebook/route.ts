import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { jwtVerify } from "jose"
import { createFacebookTokenCredential, createWorkflowFromTemplateWithAccounts, deleteWorkflow, setPlatformNodesActive, getWorkflow, createWorkflow } from "@/lib/n8n"

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

    // Ensure a per-user workflow exists; ưu tiên PATCH workflow hiện có, tránh tạo mới để không ảnh hưởng node khác
    const user = await prisma.user.findUnique({ where: { id: userId } })
    let workflowId = user?.n8nWorkflowId || null
    let webhookUrl = user?.n8nWebhookUrl || null

    if (!workflowId) {
      // Không có workflow → tạo từ template với credential được gán sẵn
      console.log('[facebook provision] Creating new workflow with Facebook credential')
      const { workflow, webhookUrl: url } = await createWorkflowFromTemplateWithAccounts({
        templateId,
        userId,
        accounts: [{
          platform: 'facebook',
          accountDisplayName: displayName,
          credentialId: cred.id,
          credentialName: cred.name,
          credentialType: 'facebookGraphApi'
        }],
      })
      workflowId = workflow.id
      webhookUrl = url || null
      await prisma.user.update({ where: { id: userId }, data: { n8nWorkflowId: workflowId, n8nWorkflowName: workflow.name, n8nWebhookUrl: webhookUrl } })
    } else {
      // Đã có workflow → PATCH để bật và gán credential cho Facebook nodes
      console.log(`[facebook provision] Patching existing workflow ${workflowId}`)
      try {
        const updated = await setPlatformNodesActive({ workflowId, platform: 'facebook', active: true, credentialId: cred.id, credentialName: cred.name })
        console.log('[facebook provision] Successfully patched workflow')
      } catch (patchError: any) {
        console.error('[facebook provision] PATCH failed:', patchError.message)
        // Fallback: tạo workflow mới với TẤT CẢ credentials hiện có để không mất platform khác
        console.log('[facebook provision] Recreating workflow with all platforms')
        
        // Lấy tất cả social accounts của user
        const allAccounts = await prisma.socialAccount.findMany({ where: { userId } })
        const accountsForWorkflow = allAccounts
          .filter(acc => acc.n8nCredentialId && acc.n8nCredentialName)
          .map(acc => ({
            platform: acc.platform,
            accountDisplayName: acc.name,
            credentialId: acc.n8nCredentialId!,
            credentialName: acc.n8nCredentialName!,
            credentialType: acc.platform === 'twitter' ? 'twitterOAuth2Api' : 'facebookGraphApi',
            nodeId: ((acc as any).metadata as any)?.igUserId
          }))
        
        console.log(`[facebook provision] Recreating with ${accountsForWorkflow.length} platforms:`, accountsForWorkflow.map(a => a.platform))
        
        const { workflow, webhookUrl: url } = await createWorkflowFromTemplateWithAccounts({
          templateId,
          userId,
          accounts: accountsForWorkflow,
        })
        
        // Xóa workflow cũ
        if (workflowId) {
          try {
            await deleteWorkflow(workflowId)
            console.log(`[facebook provision] Deleted old workflow ${workflowId}`)
          } catch (e) {
            console.warn('[facebook provision] Failed to delete old workflow:', e)
          }
        }
        
        workflowId = workflow.id
        webhookUrl = url || null
        await prisma.user.update({ where: { id: userId }, data: { n8nWorkflowId: workflowId, n8nWorkflowName: workflow.name, n8nWebhookUrl: webhookUrl } })
        
        // Update all social accounts với workflow mới
        await prisma.socialAccount.updateMany({
          where: { userId },
          data: { n8nWorkflowId: workflowId, n8nWebhookUrl: webhookUrl } as any
        })
      }
    }

    await prisma.socialAccount.update({ where: { id: social.id }, data: { n8nWorkflowId: workflowId, n8nWebhookUrl: webhookUrl } as any })

    return NextResponse.json({ success: true, workflowId, webhookUrl })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Failed" }, { status: 500 })
  }
}

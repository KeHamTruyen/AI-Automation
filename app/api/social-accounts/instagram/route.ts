import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { prisma } from "@/lib/prisma"
import { createFacebookTokenCredential, createWorkflowFromTemplateWithAccounts, setPlatformNodesActive, deleteWorkflow } from "@/lib/n8n"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

async function getUserId(request: NextRequest): Promise<string | null> {
  const cookieToken = request.cookies.get("auth-token")?.value
  const bearer = request.headers.get("authorization")?.replace("Bearer ", "")
  const token = cookieToken || bearer
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return String(payload.userId || "") || null
  } catch {
    return null
  }
}

/**
 * POST /api/social-accounts/instagram
 * Body: { accessToken: string, displayName?: string, igUserId?: string }
 * 
 * Instagram sử dụng Facebook Graph API credential.
 * Token phải có scope: instagram_basic, instagram_content_publish
 * igUserId là Instagram Business Account ID (lấy từ /me/accounts → instagram_business_account)
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request)
    if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

    const body = await request.json().catch(() => ({}))
    const { accessToken, displayName, igUserId } = body as { accessToken?: string; displayName?: string; igUserId?: string }

    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Missing accessToken" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })

    // Create Instagram credential (uses facebookGraphApi type)
    const credName = `Instagram ${displayName || user.email} ${Date.now()}`
    const cred = await createFacebookTokenCredential(credName, accessToken)

    // Check if SocialAccount already exists for this user + instagram
    let social = await prisma.socialAccount.findFirst({
      where: { userId, platform: 'instagram' }
    })

    if (!social) {
      social = await prisma.socialAccount.create({
        data: ({
          userId,
          platform: 'instagram',
          name: displayName || 'Instagram Account',
          username: displayName || 'ig_user',
          n8nCredentialId: cred.id,
          n8nCredentialName: cred.name,
          ...(igUserId ? { metadata: { igUserId } } : {})
        } as any)
      })
    } else {
      // Update existing
      await prisma.socialAccount.update({
        where: { id: social.id },
        data: ({
          n8nCredentialId: cred.id,
          n8nCredentialName: cred.name,
          name: displayName || social.name,
          ...(igUserId ? { metadata: { igUserId } } : {})
        } as any)
      })
    }

    // Ưu tiên PATCH workflow hiện có; chỉ tạo mới nếu người dùng chưa có workflow
    let workflowId = user.n8nWorkflowId || null
    let webhookUrl = user.n8nWebhookUrl || null

    if (!workflowId) {
      // Chưa có workflow → tạo mới với Instagram credential
      const templateId = process.env.N8N_TEMPLATE_WORKFLOW_ID
      if (!templateId) return NextResponse.json({ success: false, error: 'Missing N8N_TEMPLATE_WORKFLOW_ID' }, { status: 500 })
      
      const { workflow, webhookUrl: url } = await createWorkflowFromTemplateWithAccounts({ 
        templateId, 
        userId, 
        accounts: [{
          platform: 'instagram',
          accountDisplayName: displayName || 'Instagram Account',
          credentialId: cred.id,
          credentialName: cred.name,
          credentialType: 'facebookGraphApi',
          nodeId: igUserId
        }]
      })
      workflowId = workflow.id
      webhookUrl = url || null
      await prisma.user.update({ where: { id: userId }, data: { n8nWorkflowId: workflowId, n8nWorkflowName: workflow.name, n8nWebhookUrl: webhookUrl } })
    } else {
      // Đã có workflow → thử PATCH
      try {
        const updated = await setPlatformNodesActive({ workflowId, platform: 'instagram', active: true, credentialId: cred.id, credentialName: cred.name })
        console.log('[instagram provision] Successfully patched workflow')
      } catch (patchError: any) {
        console.error('[instagram provision] PATCH failed:', patchError.message)
        // Fallback: recreate với tất cả platforms
        console.log('[instagram provision] Recreating workflow with all platforms')
        
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
        
        const templateId = process.env.N8N_TEMPLATE_WORKFLOW_ID
        if (!templateId) return NextResponse.json({ success: false, error: 'Missing N8N_TEMPLATE_WORKFLOW_ID' }, { status: 500 })
        
        const { workflow, webhookUrl: url } = await createWorkflowFromTemplateWithAccounts({
          templateId,
          userId,
          accounts: accountsForWorkflow,
        })
        
        if (workflowId) {
          try {
            await deleteWorkflow(workflowId)
          } catch (e) {
            console.warn('[instagram provision] Failed to delete old workflow')
          }
        }
        
        workflowId = workflow.id
        webhookUrl = url || null
        await prisma.user.update({ where: { id: userId }, data: { n8nWorkflowId: workflowId, n8nWorkflowName: workflow.name, n8nWebhookUrl: webhookUrl } })
        await prisma.socialAccount.updateMany({
          where: { userId },
          data: { n8nWorkflowId: workflowId, n8nWebhookUrl: webhookUrl } as any
        })
      }
    }

    await prisma.socialAccount.update({ where: { id: social.id }, data: { n8nWorkflowId: workflowId, n8nWebhookUrl: webhookUrl || null } as any })

    console.log(`[instagram provision] Created credential ${cred.id}, patched workflow ${workflowId} for user ${userId}`)

    return NextResponse.json({ success: true, workflowId, webhookUrl })
  } catch (error: any) {
    console.error("[instagram provision]", error)
    return NextResponse.json({ success: false, error: error?.message || "Failed to provision Instagram" }, { status: 500 })
  }
}

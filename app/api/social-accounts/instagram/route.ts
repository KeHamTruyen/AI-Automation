import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { prisma } from "@/lib/prisma"
import { createFacebookTokenCredential, createWorkflowFromTemplateWithAccounts } from "@/lib/n8n"

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

    // Recreate workflow from template with Instagram + all other accounts bound
    const allAccounts = await prisma.socialAccount.findMany({ where: { userId } })
    const accountsForWorkflow = allAccounts.map(a => ({
      platform: a.platform,
      credentialId: a.n8nCredentialId || '',
      credentialName: a.n8nCredentialName || '',
      credentialType: a.platform === 'twitter' ? 'twitterOAuth2Api' : 'facebookGraphApi',
      displayName: a.name,
      accountDisplayName: a.name,
      nodeId: (a as any)?.metadata?.igUserId || undefined
    })).filter(a => a.credentialId)

    const { workflow, webhookUrl } = await createWorkflowFromTemplateWithAccounts({
      templateId: "instagram",
      userId,
      accounts: accountsForWorkflow
    })

    // Adopt new workflow
    await prisma.user.update({ where: { id: userId }, data: { n8nWorkflowId: workflow.id, n8nWorkflowName: workflow.name, n8nWebhookUrl: webhookUrl || null } })
    await prisma.socialAccount.update({ where: { id: social.id }, data: { n8nWorkflowId: workflow.id, n8nWorkflowName: workflow.name, n8nWebhookUrl: webhookUrl || null } as any })

    console.log(`[instagram provision] Created credential ${cred.id}, recreated workflow ${workflow.id}, adopted for user ${userId}`)

    return NextResponse.json({ success: true, workflowId: workflow.id, webhookUrl })
  } catch (error: any) {
    console.error("[instagram provision]", error)
    return NextResponse.json({ success: false, error: error?.message || "Failed to provision Instagram" }, { status: 500 })
  }
}

import { NextResponse, type NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { prisma } from "@/lib/prisma"
import { createHttpHeaderBearerCredential, createBasicAuthCredential, createTwitterOAuth2Credential, createFacebookGraphApiCredential, cloneWorkflowFromTemplate } from "@/lib/n8n"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

function jsonError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}

async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
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

export async function POST(request: NextRequest) {
  try {
    // Preflight env checks to avoid generic 500s later
    const envIssues: string[] = []
    if (!process.env.N8N_API_BASE_URL) envIssues.push('N8N_API_BASE_URL')
    if (!process.env.N8N_API_KEY) envIssues.push('N8N_API_KEY')
    if (!process.env.N8N_BASE_URL) envIssues.push('N8N_BASE_URL')
    if (envIssues.length) {
      return jsonError(`Thiếu biến môi trường: ${envIssues.join(', ')}`, 500)
    }
    const userId = await getUserIdFromRequest(request)
    if (!userId) return jsonError("Unauthorized", 401)

    const body = await request.json().catch(() => ({}))
    const { platform, name, username, accessToken, mode, clientId, clientSecret } = body as {
      platform?: string
      name?: string
      username?: string
      accessToken?: string
      mode?: 'token' | 'byo'
      clientId?: string
      clientSecret?: string
    }

    const useByo = mode === 'byo'
    if (!platform || !name || !username) {
      return jsonError("platform, name, username là bắt buộc")
    }
    if (!useByo && !accessToken) {
      return jsonError("Thiếu accessToken trong chế độ token")
    }
    if (useByo && (!clientId || !clientSecret)) {
      return jsonError("Thiếu clientId/clientSecret trong chế độ BYO")
    }

    const templateId = process.env.N8N_TEMPLATE_WORKFLOW_ID
    if (!templateId) return jsonError("Thiếu N8N_TEMPLATE_WORKFLOW_ID trong môi trường", 500)

    // 1) Tạo SocialAccount (hoặc cập nhật nếu đã có, dựa theo userId+platform+username)
    let social = await prisma.socialAccount.findFirst({ where: { userId, platform, username } })
    if (social) {
      social = await prisma.socialAccount.update({ where: { id: social.id }, data: { name, accessToken: accessToken ?? social.accessToken } })
    } else {
      social = await prisma.socialAccount.create({
        data: { userId, platform, name, username, accessToken: accessToken ?? null },
      })
    }

    // 2) Tạo n8n Credential theo mode
    let credential
    let credentialType: 'httpBasicAuth' | 'httpHeaderAuth' | 'twitterOAuth2Api' | 'facebookGraphApi'
    if (useByo) {
      const credName = `client-${platform}-${userId}-${Date.now()}`
      if (platform === 'twitter' || platform === 'x') {
        credential = await createTwitterOAuth2Credential(credName, clientId!, clientSecret!)
        credentialType = 'twitterOAuth2Api'
      } else if (platform === 'facebook') {
        credential = await createFacebookGraphApiCredential(credName, clientId!, clientSecret!)
        credentialType = 'facebookGraphApi'
      } else {
        // Fallback to basic auth shell for unsupported platforms; user can switch later
        credential = await createBasicAuthCredential(credName, clientId!, clientSecret!)
        credentialType = 'httpBasicAuth'
      }
    } else {
      const credName = `bearer-${platform}-${userId}-${Date.now()}`
      credential = await createHttpHeaderBearerCredential(credName, accessToken!)
      credentialType = 'httpHeaderAuth'
    }

    // 3) Clone workflow template và activate, bind theo credential name
    const cloned = await cloneWorkflowFromTemplate({
      templateId,
      userId,
      platform,
      credentialName: credential.name,
      credentialId: credential.id,
      credentialType,
    })

    // 4) Lưu metadata vào SocialAccount
    const updated = await prisma.socialAccount.update({
      where: { id: social.id },
      data: {
        n8nCredentialId: credential.id,
        n8nCredentialName: credential.name,
        n8nWorkflowId: cloned.workflow.id,
        n8nWorkflowName: cloned.workflow.name,
        n8nWebhookUrl: cloned.webhookUrl,
      } as any,
    })

  const connectUrl = process.env.N8N_BASE_URL ? `${process.env.N8N_BASE_URL.replace(/\/$/, '')}/credentials/${updated.n8nCredentialId}` : undefined
  return NextResponse.json({ success: true, data: { socialAccount: updated, mode: useByo ? 'byo' : 'token', connectUrl, oauthNeeded: useByo } })
  } catch (error: any) {
    console.error("[n8n provision] error:", error)
    const message = process.env.NODE_ENV !== 'production' && error?.message
      ? `Provision failed: ${error.message}`
      : "Không thể provision workflow/credential n8n. Kiểm tra log server và cấu hình env."
    return jsonError(message, 500)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) return jsonError("Unauthorized", 401)

    const { searchParams } = new URL(request.url)
    const socialId = searchParams.get("socialAccountId")
    if (!socialId) return jsonError("Thiếu socialAccountId")

  const social = await prisma.socialAccount.findUnique({ where: { id: socialId } })
    if (!social || social.userId !== userId) return jsonError("Không tìm thấy social account", 404)

    // Best-effort xóa trong n8n (không fail cứng nếu lỗi)
    try {
      if ((social as any).n8nWorkflowId) {
        const { deleteWorkflow } = await import("@/lib/n8n")
        await deleteWorkflow((social as any).n8nWorkflowId)
      }
    } catch (e) {
      console.warn("Delete workflow failed:", e)
    }
    try {
      if ((social as any).n8nCredentialId) {
        const { deleteCredential } = await import("@/lib/n8n")
        await deleteCredential((social as any).n8nCredentialId)
      }
    } catch (e) {
      console.warn("Delete credential failed:", e)
    }

    const cleared = await prisma.socialAccount.update({
      where: { id: social.id },
      data: {
        n8nCredentialId: null,
        n8nCredentialName: null,
        n8nWorkflowId: null,
        n8nWorkflowName: null,
        n8nWebhookUrl: null,
      } as any,
    })

    return NextResponse.json({ success: true, data: { socialAccount: cleared } })
  } catch (error: any) {
    console.error("[n8n deprovision] error:", error)
    const message = process.env.NODE_ENV !== 'production' && error?.message
      ? `Deprovision failed: ${error.message}`
      : "Không thể deprovision n8n. Kiểm tra log server và cấu hình env."
    return jsonError(message, 500)
  }
}

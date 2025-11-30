import { NextResponse, type NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { prisma } from "@/lib/prisma"
import { createHttpHeaderBearerCredential, createBasicAuthCredential, createTwitterOAuth2Credential, createFacebookGraphApiCredential, cloneWorkflowFromTemplate, addPlatformAccountNode, updateExistingNodeCredential, createFacebookTokenCredential, createWorkflowFromTemplateWithAccounts, deleteWorkflow } from "@/lib/n8n"

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
    // 2) Lấy hoặc tạo workflow cấp user (nếu chưa có)
    let user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return jsonError("User không tồn tại", 404)
    let userWorkflowId = user.n8nWorkflowId
    let userWorkflowName = user.n8nWorkflowName
    let userWebhookUrl = user.n8nWebhookUrl
    let newlyCreatedUserWorkflow = false

    if (!userWorkflowId) {
      // Clone 1 workflow master cho user (platform generic 'base')
      const baseClone = await cloneWorkflowFromTemplate({
        templateId,
        userId,
        platform: 'base',
      })
      userWorkflowId = baseClone.workflow.id
      userWorkflowName = baseClone.workflow.name
      userWebhookUrl = baseClone.webhookUrl || null
      newlyCreatedUserWorkflow = true
      await prisma.user.update({ where: { id: userId }, data: { n8nWorkflowId: userWorkflowId, n8nWorkflowName: userWorkflowName, n8nWebhookUrl: userWebhookUrl } })
    }

    // 3) Tạo n8n Credential theo mode
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
      // Token mode: nếu là Facebook, tạo credential native facebookGraphApi từ access token; ngược lại dùng httpHeaderAuth
      if (platform === 'facebook') {
        const credName = `fb-token-${userId}-${Date.now()}`
        credential = await createFacebookTokenCredential(credName, accessToken!)
        credentialType = 'facebookGraphApi'
      } else {
        const credName = `bearer-${platform}-${userId}-${Date.now()}`
        credential = await createHttpHeaderBearerCredential(credName, accessToken!)
        credentialType = 'httpHeaderAuth'
      }
    }
    // 4) Gắn credential vào node sẵn có nếu là facebook và đã có node trống, ngược lại thêm node mới
    let updatedWorkflowId = userWorkflowId!
    let updatedWorkflowName = userWorkflowName!
    let updatedWebhookUrl = userWebhookUrl || null
    let nodeUpdated = false
    if (platform === 'facebook') {
      try {
        const res = await updateExistingNodeCredential({
          workflowId: updatedWorkflowId,
          platform,
          credentialId: credential.id,
          credentialName: credential.name,
          credentialType,
          nodeNameHint: 'facebook',
        })
        nodeUpdated = res.updated
      } catch (e: any) {
        console.warn('Không thể cập nhật node facebook:', e?.message)
      }
    }
    if (!nodeUpdated) {
      // Thử thêm node mới; nếu PATCH bị chặn, fallback: tái tạo workflow từ template và bind credential trực tiếp
      try {
        await addPlatformAccountNode({
          workflowId: updatedWorkflowId,
          platform,
          accountDisplayName: name,
          credentialId: credential.id,
          credentialName: credential.name,
          credentialType,
        })
      } catch (e: any) {
        const msg = String(e?.message || '')
        console.warn('Không thể thêm node account vào workflow (không tạo workflow mới):', msg)
        if (/PATCH to update workflow is blocked/i.test(msg)) {
          // Recreate full workflow from template with ALL accounts to preserve other platforms
          try {
            console.log('[n8n provision] PATCH blocked, recreating with all accounts')
            
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
            
            // Thêm account hiện tại nếu chưa có trong list
            const hasCurrentAccount = accountsForWorkflow.some(a => 
              a.platform === platform && a.credentialId === credential.id
            )
            if (!hasCurrentAccount) {
              accountsForWorkflow.push({
                platform,
                accountDisplayName: name,
                credentialId: credential.id,
                credentialName: credential.name,
                credentialType,
                nodeId: undefined
              })
            }
            
            console.log(`[n8n provision] Recreating with ${accountsForWorkflow.length} platforms:`, accountsForWorkflow.map(a => a.platform))
            
            const { workflow, webhookUrl } = await createWorkflowFromTemplateWithAccounts({
              templateId,
              userId,
              accounts: accountsForWorkflow,
            })
            
            const oldId = updatedWorkflowId
            updatedWorkflowId = workflow.id
            updatedWorkflowName = workflow.name
            updatedWebhookUrl = webhookUrl || null
            
            await prisma.user.update({ 
              where: { id: userId }, 
              data: { 
                n8nWorkflowId: updatedWorkflowId, 
                n8nWorkflowName: updatedWorkflowName, 
                n8nWebhookUrl: updatedWebhookUrl 
              } 
            })
            
            // Update all social accounts với workflow mới
            await prisma.socialAccount.updateMany({
              where: { userId },
              data: { n8nWorkflowId: updatedWorkflowId, n8nWebhookUrl: updatedWebhookUrl } as any
            })
            
            // Xóa workflow cũ
            if (oldId && oldId !== updatedWorkflowId) {
              try { 
                await deleteWorkflow(oldId)
                console.log(`[n8n provision] Deleted old workflow ${oldId}`)
              } catch {}
            }
          } catch (err) {
            console.warn('Fallback recreate workflow failed:', (err as any)?.message)
          }
        }
      }
    }

    // 5) Lưu metadata vào SocialAccount (chỉ credential, workflow tham chiếu user-level)
    const updated = await prisma.socialAccount.update({
      where: { id: social.id },
      data: {
        n8nCredentialId: credential.id,
        n8nCredentialName: credential.name,
        n8nWorkflowId: updatedWorkflowId,
        n8nWorkflowName: updatedWorkflowName,
        n8nWebhookUrl: updatedWebhookUrl,
      } as any,
    })
    const connectUrl = process.env.N8N_BASE_URL ? `${process.env.N8N_BASE_URL.replace(/\/$/, '')}/credentials/${updated.n8nCredentialId}` : undefined
    return NextResponse.json({ success: true, data: { socialAccount: updated, mode: useByo ? 'byo' : 'token', connectUrl, oauthNeeded: useByo, userWorkflowCreated: newlyCreatedUserWorkflow, nodeUpdated, workflowId: updatedWorkflowId, webhookUrl: updatedWebhookUrl } })
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

    // Không xóa user master workflow. Chỉ xóa workflow nếu đó là workflow legacy (per-account)
    // và không còn social account nào khác tham chiếu tới nó.
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } })
      const masterId = user?.n8nWorkflowId || null
      const wfId = (social as any).n8nWorkflowId as string | null
      if (wfId) {
        if (masterId && wfId === masterId) {
          // Disable nodes của platform này thay vì xóa node
          try {
            console.log(`[n8n deprovision] Disabling ${social.platform} nodes in workflow ${wfId}`)
            const { setPlatformNodesActive } = await import("@/lib/n8n")
            
            // Map platform to correct platform type
            const platformMap: Record<string, 'facebook' | 'instagram' | 'twitter'> = {
              'facebook': 'facebook',
              'instagram': 'instagram',
              'twitter': 'twitter',
              'x': 'twitter'
            }
            const platformKey = platformMap[social.platform.toLowerCase()] || 'facebook'
            
            await setPlatformNodesActive({
              workflowId: wfId,
              platform: platformKey,
              active: false, // Disable nodes
            })
            
            console.log(`[n8n deprovision] Disabled ${social.platform} nodes successfully`)
          } catch (err: any) {
            console.warn('Disable nodes failed:', (err as any)?.message)
            
            // Fallback: Nếu PATCH bị chặn, recreate workflow với platform này bị disabled
            if (/PATCH to update workflow is blocked/i.test(err?.message) || /405/i.test(err?.message)) {
              console.log('[n8n deprovision] PATCH blocked, recreating workflow with platform disabled')
              try {
                const allAccounts = await prisma.socialAccount.findMany({ where: { userId } })
                const accountsForWorkflow = allAccounts
                  .filter(acc => acc.id !== social.id && acc.n8nCredentialId && acc.n8nCredentialName)
                  .map(acc => ({
                    platform: acc.platform,
                    accountDisplayName: acc.name,
                    credentialId: acc.n8nCredentialId!,
                    credentialName: acc.n8nCredentialName!,
                    credentialType: acc.platform === 'twitter' ? 'twitterOAuth2Api' : 'facebookGraphApi',
                    nodeId: ((acc as any).metadata as any)?.igUserId
                  }))
                
                const templateId = process.env.N8N_TEMPLATE_WORKFLOW_ID
                if (templateId) {
                  const { createWorkflowFromTemplateWithAccounts, deleteWorkflow } = await import("@/lib/n8n")
                  const { workflow, webhookUrl } = await createWorkflowFromTemplateWithAccounts({
                    templateId,
                    userId,
                    accounts: accountsForWorkflow,
                  })
                  
                  const oldId = wfId
                  await prisma.user.update({
                    where: { id: userId },
                    data: {
                      n8nWorkflowId: workflow.id,
                      n8nWorkflowName: workflow.name,
                      n8nWebhookUrl: webhookUrl || null
                    }
                  })
                  
                  await prisma.socialAccount.updateMany({
                    where: { userId },
                    data: { n8nWorkflowId: workflow.id, n8nWebhookUrl: webhookUrl || null } as any
                  })
                  
                  if (oldId && oldId !== workflow.id) {
                    try {
                      await deleteWorkflow(oldId)
                    } catch {}
                  }
                  
                  console.log(`[n8n deprovision] Recreated workflow without ${social.platform}`)
                }
              } catch (recreateErr) {
                console.warn('Recreate workflow failed:', (recreateErr as any)?.message)
              }
            }
          }
        } else {
          // Possibly legacy per-account workflow. Delete only if no one else references it.
          const cnt = await prisma.socialAccount.count({ where: { n8nWorkflowId: wfId, NOT: { id: social.id } } })
          if (cnt === 0) {
            try {
              const { deleteWorkflow } = await import("@/lib/n8n")
              await deleteWorkflow(wfId)
            } catch (err) {
              console.warn("Delete legacy workflow failed:", err)
            }
          }
        }
      }
    } catch (e) {
      console.warn("Workflow cleanup step warning:", e)
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
        // Keep workflow reference intact for master; clear only if it was per-account legacy
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

import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { prisma } from '../lib/prisma'
import { cloneWorkflowFromTemplate, addPlatformAccountNode, getWorkflow, createHttpHeaderBearerCredential, createWorkflowFromTemplateWithAccounts, deleteWorkflow } from '../lib/n8n'

async function loadEnv() {
  const envLocal = path.resolve(process.cwd(), '.env.local')
  if (fs.existsSync(envLocal)) dotenv.config({ path: envLocal, override: true })
}

async function ensureUserWorkflow(userId: string, templateId: string) {
  let user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error(`User not found: ${userId}`)

  let needsClone = !user.n8nWorkflowId
  if (user.n8nWorkflowId) {
    try { await getWorkflow(user.n8nWorkflowId) } catch { needsClone = true }
  }

  if (needsClone) {
    const { workflow, webhookUrl } = await cloneWorkflowFromTemplate({ templateId, userId, platform: 'base' })
    await prisma.user.update({ where: { id: userId }, data: { n8nWorkflowId: workflow.id, n8nWorkflowName: workflow.name, n8nWebhookUrl: webhookUrl || null } })
    user = await prisma.user.findUnique({ where: { id: userId } })
  }
  return user!
}

type AccountWithCred = {
  id: string
  platform: string
  username?: string | null
  name?: string | null
  accessToken?: string | null
  n8nCredentialId?: string | null
  n8nCredentialName?: string | null
}

async function prepareAccountCredentials(userId: string, accounts: AccountWithCred[]) {
  const prepared: Array<{
    accountId: string
    platform: string
    accountDisplayName: string
    credentialId: string
    credentialName: string
    credentialType: string
  }> = []

  for (const social of accounts) {
    const platform = String(social.platform || '').toLowerCase()
    const name = social.name || social.username || platform

    let credId = social.n8nCredentialId || null
    let credName = social.n8nCredentialName || null
    const credType = 'httpHeaderAuth'

    if (!social.accessToken) {
      if (!credId || !credName) {
        console.warn(`Account ${social.id} has no accessToken and no credential; skipping credential creation.`)
        continue
      }
    } else {
      const created = await createHttpHeaderBearerCredential(`bearer-${platform}-${userId}-${Date.now()}`, social.accessToken)
      credId = created.id
      credName = created.name
      await prisma.socialAccount.update({ where: { id: social.id }, data: { n8nCredentialId: credId, n8nCredentialName: credName } })
    }

    if (!credId || !credName) {
      console.warn(`Skipping node add for ${social.id} due to missing credential`)
      continue
    }

    prepared.push({
      accountId: social.id,
      platform,
      accountDisplayName: name!,
      credentialId: credId!,
      credentialName: credName!,
      credentialType: credType,
    })
  }

  return prepared
}

async function main() {
  await loadEnv()
  const templateId = process.env.N8N_TEMPLATE_WORKFLOW_ID
  if (!templateId) throw new Error('Missing N8N_TEMPLATE_WORKFLOW_ID')

  const users = await prisma.user.findMany({ select: { id: true, email: true } })
  console.log(`Reprovisioning n8n for ${users.length} user(s)...`)

  for (const u of users) {
    try {
      let user = await ensureUserWorkflow(u.id, templateId)
      const accountsRaw = await prisma.socialAccount.findMany({ where: { userId: u.id } })
      const prepared = await prepareAccountCredentials(u.id, accountsRaw as any)

      console.log(`- ${u.email}: workflow ${user.n8nWorkflowId}, accounts=${accountsRaw.length}`)

      if (prepared.length === 0) {
        // Nothing to add; just sync references
        for (const acc of accountsRaw) {
          await prisma.socialAccount.update({ where: { id: acc.id }, data: { n8nWorkflowId: user.n8nWorkflowId, n8nWorkflowName: user.n8nWorkflowName, n8nWebhookUrl: user.n8nWebhookUrl } as any })
        }
        continue
      }

      let patchBlocked = false
      // Try to add via PATCH first for existing workflow
      for (const acc of prepared) {
        try {
          await addPlatformAccountNode({
            workflowId: user.n8nWorkflowId!,
            platform: acc.platform,
            accountDisplayName: acc.accountDisplayName,
            credentialId: acc.credentialId,
            credentialName: acc.credentialName,
            credentialType: acc.credentialType,
          })
        } catch (e: any) {
          const msg = String(e?.message || '')
          if (/PATCH to update workflow is blocked/i.test(msg)) {
            patchBlocked = true
            console.error(`  ✖ Account ${acc.platform}/${acc.accountDisplayName}: ${msg}`)
            break
          } else {
            throw e
          }
        }
      }

      if (patchBlocked) {
        // Fallback: construct a brand-new workflow including all accounts and adopt it
        const { workflow, webhookUrl } = await createWorkflowFromTemplateWithAccounts({
          templateId,
          userId: u.id,
          accounts: prepared.map(p => ({
            platform: p.platform,
            accountDisplayName: p.accountDisplayName,
            credentialId: p.credentialId,
            credentialName: p.credentialName,
            credentialType: p.credentialType,
          }))
        })

        const oldWorkflowId = user.n8nWorkflowId
        user = await prisma.user.update({ where: { id: u.id }, data: { n8nWorkflowId: workflow.id, n8nWorkflowName: workflow.name, n8nWebhookUrl: webhookUrl || null } })
        for (const acc of accountsRaw) {
          await prisma.socialAccount.update({ where: { id: acc.id }, data: { n8nWorkflowId: workflow.id, n8nWorkflowName: workflow.name, n8nWebhookUrl: webhookUrl || null } as any })
        }
        console.log(`  ✔ Recreated workflow ${workflow.id} with ${prepared.length} account node(s); adopted for user.`)
        // Try to delete old workflow to avoid duplicates (ignore errors)
        if (oldWorkflowId && oldWorkflowId !== workflow.id) {
          try { await deleteWorkflow(oldWorkflowId) } catch { /* ignore */ }
        }
      } else {
        // Sync references after successful PATCH adds
        for (const acc of accountsRaw) {
          await prisma.socialAccount.update({ where: { id: acc.id }, data: { n8nWorkflowId: user.n8nWorkflowId, n8nWorkflowName: user.n8nWorkflowName, n8nWebhookUrl: user.n8nWebhookUrl } as any })
        }
      }
    } catch (e: any) {
      console.error(`✖ User ${u.email}: ${e?.message || e}`)
    }
  }

  await prisma.$disconnect()
}

main().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })

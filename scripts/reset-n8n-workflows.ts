import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { prisma } from '../lib/prisma'
import { cloneWorkflowFromTemplate, deleteWorkflow, getWorkflow, deleteCredential } from '../lib/n8n'

async function loadEnv() {
  const envLocal = path.resolve(process.cwd(), '.env.local')
  if (fs.existsSync(envLocal)) dotenv.config({ path: envLocal, override: true })
}

async function ensureFreshWorkflow(userId: string, templateId: string) {
  // Try delete old workflow if any
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (user?.n8nWorkflowId) {
    try { await getWorkflow(user.n8nWorkflowId); await deleteWorkflow(user.n8nWorkflowId) } catch { /* ignore */ }
  }
  const { workflow, webhookUrl } = await cloneWorkflowFromTemplate({ templateId, userId, platform: 'base' })
  await prisma.user.update({ where: { id: userId }, data: { n8nWorkflowId: workflow.id, n8nWorkflowName: workflow.name, n8nWebhookUrl: webhookUrl || null } })
}

async function removeAccountsAndCredentials(userId: string) {
  // Collect credentials to optionally delete from n8n
  const accounts = await prisma.socialAccount.findMany({ where: { userId } })
  const credIds = Array.from(new Set(accounts.map(a => a.n8nCredentialId).filter(Boolean) as string[]))

  // Delete DB rows
  await prisma.socialAccount.deleteMany({ where: { userId } })

  // Best-effort delete credentials in n8n (ignore errors)
  for (const id of credIds) {
    try { await deleteCredential(id) } catch { /* ignore */ }
  }
}

async function main() {
  await loadEnv()
  const templateId = process.env.N8N_TEMPLATE_WORKFLOW_ID
  if (!templateId) throw new Error('Missing N8N_TEMPLATE_WORKFLOW_ID')

  const users = await prisma.user.findMany({ select: { id: true, email: true } })
  console.log(`Resetting DB social accounts and recreating workflows for ${users.length} user(s)...`)

  for (const u of users) {
    try {
      console.log(`- ${u.email}: deleting linked accounts and credentials...`)
      await removeAccountsAndCredentials(u.id)
      console.log(`  Creating fresh workflow from template...`)
      await ensureFreshWorkflow(u.id, templateId)
      const refreshed = await prisma.user.findUnique({ where: { id: u.id } })
      console.log(`  ✔ Adopted workflow ${refreshed?.n8nWorkflowId}`)
    } catch (e: any) {
      console.error(`✖ User ${u.email}: ${e?.message || e}`)
    }
  }

  await prisma.$disconnect()
}

main().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })

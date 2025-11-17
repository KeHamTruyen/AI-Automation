import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { prisma } from '../lib/prisma'
import { cloneWorkflowFromTemplate } from '../lib/n8n'

async function loadEnv() {
  // Load .env.local if present (in addition to default dotenv/config)
  const envLocal = path.resolve(process.cwd(), '.env.local')
  if (fs.existsSync(envLocal)) {
    dotenv.config({ path: envLocal, override: true })
  }
}

async function main() {
  await loadEnv()
  const templateId = process.env.N8N_TEMPLATE_WORKFLOW_ID
  if (!templateId) {
    console.error('Missing N8N_TEMPLATE_WORKFLOW_ID in env')
    process.exit(1)
  }

  const users = await prisma.user.findMany({
    where: { n8nWorkflowId: null },
    select: { id: true, email: true, name: true },
  })

  if (users.length === 0) {
    console.log('All users already have n8n workflows. Nothing to do.')
    return
  }

  console.log(`Backfilling n8n workflows for ${users.length} user(s) ...`)
  for (const u of users) {
    try {
      const { workflow, webhookUrl } = await cloneWorkflowFromTemplate({
        templateId,
        userId: u.id,
        platform: 'base',
      })
      await prisma.user.update({
        where: { id: u.id },
        data: {
          n8nWorkflowId: workflow.id,
          n8nWorkflowName: workflow.name,
          n8nWebhookUrl: webhookUrl || null,
        },
      })
      console.log(`✔ User ${u.email} (${u.id}) → workflow ${workflow.id}`)
    } catch (e: any) {
      console.error(`✖ Failed for user ${u.email} (${u.id}):`, e?.message || e)
    }
  }

  await prisma.$disconnect()
}

main().catch(async (err) => {
  console.error(err)
  await prisma.$disconnect()
  process.exit(1)
})

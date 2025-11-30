import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Args {
  email: string;
  workflowId?: string;
  workflowName?: string;
  webhookUrl?: string;
  socialAccountId?: string; // optional: if also restoring per-account metadata
  accountWorkflowId?: string;
  accountWorkflowName?: string;
  accountWebhookUrl?: string;
}

function parseArgs(): Args {
  const raw = process.argv.slice(2);
  const args: Record<string,string> = {};
  for (let i = 0; i < raw.length; i++) {
    const part = raw[i];
    if (part.startsWith('--')) {
      const key = part.substring(2);
      const val = raw[i+1];
      if (val && !val.startsWith('--')) {
        args[key] = val;
        i++;
      } else {
        args[key] = 'true';
      }
    }
  }
  if (!args.email) {
    console.error('Missing --email');
    process.exit(1);
  }
  return {
    email: args.email,
    workflowId: args.workflowId,
    workflowName: args.workflowName,
    webhookUrl: args.webhookUrl,
    socialAccountId: args.socialAccountId,
    accountWorkflowId: args.accountWorkflowId,
    accountWorkflowName: args.accountWorkflowName,
    accountWebhookUrl: args.accountWebhookUrl,
  };
}

async function main() {
  const a = parseArgs();
  console.log('[restore] Starting restoration for', a.email);

  const user = await prisma.user.findUnique({ where: { email: a.email } });
  if (!user) {
    throw new Error('User not found: ' + a.email);
  }

  if (a.workflowId || a.workflowName || a.webhookUrl) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        n8nWorkflowId: a.workflowId || user.n8nWorkflowId,
        n8nWorkflowName: a.workflowName || user.n8nWorkflowName,
        n8nWebhookUrl: a.webhookUrl || user.n8nWebhookUrl,
      }
    });
    console.log('[restore] User workflow metadata updated');
  } else {
    console.log('[restore] Skipped user workflow metadata (no args)');
  }

  if (a.socialAccountId) {
    const sa = await prisma.socialAccount.findUnique({ where: { id: a.socialAccountId } });
    if (!sa) throw new Error('SocialAccount not found: ' + a.socialAccountId);
    await prisma.socialAccount.update({
      where: { id: sa.id },
      data: {
        n8nWorkflowId: a.accountWorkflowId || sa.n8nWorkflowId,
        n8nWorkflowName: a.accountWorkflowName || sa.n8nWorkflowName,
        n8nWebhookUrl: a.accountWebhookUrl || sa.n8nWebhookUrl,
      }
    });
    console.log('[restore] Social account workflow metadata updated');
  }

  console.log('[restore] Done');
}

main().catch(e => {
  console.error('Restore failed', e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});

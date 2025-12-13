const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Get user's workflow
  const user = await prisma.user.findFirst({
    where: { id: 'cmiwy249i000152h9ryfc2tev' }
  });

  console.log('User workflow ID:', user.n8nWorkflowId);
  console.log('User workflow name:', user.n8nWorkflowName);
  
  // Get LinkedIn account
  const linkedinAccount = await prisma.socialAccount.findFirst({
    where: {
      userId: user.id,
      platform: 'LINKEDIN'
    }
  });

  console.log('\n📋 LinkedIn Account:');
  console.log('  - Credential ID:', linkedinAccount.n8nCredentialId);
  console.log('  - Credential Name:', linkedinAccount.n8nCredentialName);
  console.log('  - LinkedIn URN:', linkedinAccount.linkedinUrn);
  console.log('  - Access Token exists:', !!linkedinAccount.accessToken);
  console.log('  - Token expires:', linkedinAccount.expiresAt);

  await prisma.$disconnect();
}

main().catch(console.error);

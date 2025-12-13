const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const userId = 'cmiwy249i000152h9ryfc2tev';
  
  const accounts = await prisma.socialAccount.findMany({
    where: { userId }
  });

  console.log(`Found ${accounts.length} social accounts:\n`);
  
  accounts.forEach((acc, i) => {
    console.log(`${i + 1}. ${acc.platform}:`);
    console.log(`   - ID: ${acc.id}`);
    console.log(`   - Name: ${acc.name}`);
    console.log(`   - Credential ID: ${acc.n8nCredentialId}`);
    console.log(`   - LinkedIn URN: ${acc.linkedinUrn || 'N/A'}`);
    console.log(`   - Access Token: ${acc.accessToken ? 'EXISTS' : 'MISSING'}`);
    console.log(`   - Expires: ${acc.expiresAt}`);
    console.log('');
  });

  await prisma.$disconnect();
}

main().catch(console.error);

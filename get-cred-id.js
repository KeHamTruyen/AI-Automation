// Get credential ID from database
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function getCredentialId() {
  const account = await prisma.socialAccount.findFirst({
    where: {
      platform: 'linkedin',
      userId: 'cmiwy249i000152h9ryfc2tev'
    }
  })
  
  console.log('Social Account:', {
    id: account?.id,
    name: account?.name,
    n8nCredentialId: account?.n8nCredentialId,
    n8nCredentialName: account?.n8nCredentialName,
    linkedinUrn: account?.linkedinUrn,
  })
  
  await prisma.$disconnect()
}

getCredentialId().catch(console.error)

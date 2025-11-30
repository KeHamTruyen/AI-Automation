import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create demo users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      email: 'admin@company.com',
      name: 'Admin User',
      password: 'admin123', // In production, use: await bcrypt.hash('admin123', 10)
      role: 'ADMIN',
    },
  })

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@company.com' },
    update: {},
    create: {
      email: 'user@company.com',
      name: 'Regular User',
      password: 'user123', // In production, use: await bcrypt.hash('user123', 10)
      role: 'USER',
    },
  })

  console.log('✅ Demo users created:')
  console.log('  - Admin:', adminUser.email)
  console.log('  - User:', regularUser.email)

  // Create demo social accounts
  const socialAccount1 = await prisma.socialAccount.create({
    data: {
      platform: 'facebook',
      name: 'Company Facebook Page',
      username: 'company_facebook',
      userId: adminUser.id,
      followers: 5000,
    },
  })

  const socialAccount2 = await prisma.socialAccount.create({
    data: {
      platform: 'instagram',
      name: 'Company Instagram',
      username: 'company_instagram',
      userId: adminUser.id,
      followers: 8500,
    },
  })

  console.log('✅ Demo social accounts created:')
  console.log('  - Facebook:', socialAccount1.name)
  console.log('  - Instagram:', socialAccount2.name)

  // Create demo content
  const content1 = await prisma.content.create({
    data: {
      title: 'Welcome Post',
      content: 'Welcome to our AI Marketing Engine! 🚀',
      type: 'POST',
      status: 'PUBLISHED',
      userId: adminUser.id,
      publishedAt: new Date(),
    },
  })

  // Create publications for both demo social accounts
  await prisma.contentPublication.createMany({
    data: [
      {
        contentId: content1.id,
        socialAccountId: socialAccount1.id,
        status: 'SUCCESS',
        publishedAt: new Date(),
      },
      {
        contentId: content1.id,
        socialAccountId: socialAccount2.id,
        status: 'SUCCESS',
        publishedAt: new Date(),
      },
    ],
  })

  console.log('✅ Demo content created with multi-account publications:', content1.title)

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

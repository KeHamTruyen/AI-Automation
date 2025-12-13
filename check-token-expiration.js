const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTokenExpiration() {
  const linkedinAccount = await prisma.socialAccount.findFirst({
    where: {
      platform: 'linkedin',
      userId: 'cmiwy249i000152h9ryfc2tev'
    }
  });

  console.log('📋 LinkedIn Account Info:');
  console.log('  - Name:', linkedinAccount.name);
  console.log('  - Access Token:', linkedinAccount.accessToken ? 'EXISTS' : 'MISSING');
  console.log('  - Refresh Token:', linkedinAccount.refreshToken ? 'EXISTS' : 'MISSING');
  console.log('  - Expires At:', linkedinAccount.expiresAt);
  console.log('  - Created At:', linkedinAccount.createdAt);
  console.log('  - Updated At:', linkedinAccount.updatedAt);

  if (linkedinAccount.expiresAt) {
    const now = new Date();
    const expiresAt = new Date(linkedinAccount.expiresAt);
    const diffMs = expiresAt - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    console.log('\n⏱️  Token Status:');
    if (diffMs > 0) {
      console.log(`  ✅ Token còn hiệu lực: ${diffDays} ngày ${diffHours} giờ`);
    } else {
      console.log(`  ❌ Token đã hết hạn ${Math.abs(diffDays)} ngày trước`);
    }
  } else {
    console.log('\n⚠️  Không có thông tin expires_at - token có thể không tự động làm mới được');
    
    // Check when token was created
    const now = new Date();
    const createdAt = new Date(linkedinAccount.createdAt);
    const ageMs = now - createdAt;
    const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
    const ageHours = Math.floor((ageMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    console.log(`  - Token được tạo ${ageDays} ngày ${ageHours} giờ trước`);
    console.log(`  - LinkedIn access token thường có thời hạn 60 ngày`);
    
    const remainingDays = 60 - ageDays;
    if (remainingDays > 0) {
      console.log(`  - Ước tính còn lại: ~${remainingDays} ngày (nếu token 60 ngày)`);
    } else {
      console.log(`  - ⚠️  Token có thể đã hết hạn!`);
    }
  }

  console.log('\n📌 Lưu ý:');
  console.log('  - LinkedIn access token có thời hạn 60 ngày');
  console.log('  - Hệ thống KHÔNG có refresh token để tự động gia hạn');
  console.log('  - Khi hết hạn, bạn cần OAuth lại từ đầu');

  await prisma.$disconnect();
}

checkTokenExpiration().catch(console.error);

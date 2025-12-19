import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkScheduledPostUsers() {
  try {
    console.log('=== KIỂM TRA USER CỦA SCHEDULED POSTS ===\n');
    
    await prisma.$connect();
    
    const posts = await prisma.scheduledPost.findMany({
      include: {
        user: {
          select: {
            email: true,
            n8nWebhookUrl: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    console.log(`Tìm thấy ${posts.length} scheduled posts:\n`);
    
    posts.forEach((post, i) => {
      console.log(`${i + 1}. Job ID: ${post.id}`);
      console.log(`   User: ${post.user.email}`);
      console.log(`   User Webhook: ${post.user.n8nWebhookUrl || '❌ CHƯA CÓ'}`);
      console.log(`   Content: "${post.contentText.substring(0, 40)}..."`);
      console.log(`   Status: ${post.status}`);
      console.log(`   Platforms: ${post.platforms.join(', ')}`);
      console.log(`   Scheduled: ${post.scheduledAt.toLocaleString('vi-VN')}`);
      console.log('');
    });
    
    // Chẩn đoán
    console.log('=== CHẨN ĐOÁN ===\n');
    
    const postsWithoutWebhook = posts.filter(p => !p.user.n8nWebhookUrl);
    
    if (postsWithoutWebhook.length > 0) {
      console.log(`❌ ${postsWithoutWebhook.length} jobs được tạo bởi users KHÔNG CÓ webhook:`);
      postsWithoutWebhook.forEach(p => {
        console.log(`   - ${p.id} (by ${p.user.email})`);
      });
      console.log('\nGiải pháp:');
      console.log('→ Đăng nhập bằng user@company.com (có webhook)');
      console.log('→ Tạo scheduled post MỚI');
      console.log('→ Xóa các jobs cũ không có webhook\n');
    } else {
      console.log('✓ Tất cả jobs đều có webhook URL');
      console.log('→ Vấn đề không phải ở user webhook\n');
    }
    
    await prisma.$disconnect();
  } catch (e) {
    console.error('Lỗi:', e);
    process.exit(1);
  }
}

checkScheduledPostUsers();

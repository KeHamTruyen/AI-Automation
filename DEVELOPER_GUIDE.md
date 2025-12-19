# AI Marketing Engine - Tài liệu Phát triển

> Tài liệu này dành cho developer tiếp quản dự án. Mô tả kiến trúc, chức năng hiện tại, và hướng phát triển tương lai.

---

## Tổng quan Dự án

AI Marketing Engine là nền tảng marketing tự động tích hợp AI, giúp doanh nghiệp quản lý content và đăng bài lên nhiều kênh social media (Facebook, Instagram, LinkedIn).

**Tech Stack chính:**
- Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- Backend: Next.js API Routes, Prisma ORM
- Database: PostgreSQL
- Storage: Cloudflare R2 (S3-compatible)
- Workflow: n8n (automation & publishing)
- AI: OpenAI GPT (content generation, image generation)

---

## Cấu trúc Thư mục

```
AI-Automation/
├── app/                              # Next.js App Router
│   ├── api/                          # API endpoints
│   │   ├── auth/                     # Authentication
│   │   │   ├── login/                # POST - Login
│   │   │   ├── logout/               # POST - Logout
│   │   │   ├── register/             # POST - Register
│   │   │   ├── me/                   # GET - User info
│   │   │   └── linkedin/             # LinkedIn OAuth flow
│   │   ├── contents/                 # Published content
│   │   │   └── [id]/                 # GET - Chi tiết bài đã đăng
│   │   ├── drafts/                   # Draft management
│   │   │   └── [id]/                 # GET/PATCH - Draft CRUD
│   │   ├── posts/                    # POST - Publish content
│   │   ├── schedule/                 # Scheduler API
│   │   ├── social-accounts/          # Social account CRUD
│   │   ├── uploads/                  # File upload to R2
│   │   ├── media/transfer/           # AI image → R2 transfer
│   │   └── integrations/n8n/         # n8n workflow provisioning
│   │
│   ├── login/                        # Login page
│   ├── dashboard/                    # Dashboard (có nút logout)
│   ├── content-creation/             # Tạo nội dung AI + đăng bài
│   ├── social-accounts/              # Quản lý kết nối social
│   ├── archive/                      # Lưu trữ Published/Draft
│   │   └── [id]/                     # Chi tiết (read-only/edit)
│   ├── brand-analysis/               # Phân tích thương hiệu (UI only)
│   ├── cms/                          # Content management (UI only)
│   ├── performance-management/       # Analytics (UI only)
│   └── ai-representative/            # AI Avatar (UI only)
│
├── components/                       # Reusable components
│   ├── ui/                           # shadcn/ui components
│   └── auth-provider.tsx             # Auth context
│
├── lib/                              # Utilities
│   ├── prisma.ts                     # Database client
│   ├── linkedin.ts                   # LinkedIn OAuth helpers
│   ├── n8n.ts                        # n8n API wrapper
│   ├── r2.ts                         # Cloudflare R2 helpers
│   └── utils.ts                      # Common utilities
│
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── seed.ts                       # Seed data
│
├── scheduler/                        # Background worker
│   └── index.ts                      # Cron job cho scheduled posts
│
├── middleware.ts                     # Route protection
└── public/                           # Static assets
```

---

## Chức năng Đang Hoạt động

### 1. Authentication & Authorization
**Trang:** `/login`  
**API:** `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`

- Đăng nhập với email/password
- JWT token lưu trong HTTP-only cookie
- Role-based access (Admin/User)
- Protected routes tự động redirect về `/login`
- Mock authentication hỗ trợ (không cần database):
  - Admin: `admin@company.com` / `admin123`
  - User: `user@company.com` / `user123`

**Đang hoạt động:**
- Login/logout flow
- Middleware protection cho tất cả routes trừ `/login`
- Logout button trong Dashboard header

**Cần cải thiện:**
- Password reset/forgot password
- Email verification
- 2FA

---

### 2. Social Accounts Management
**Trang:** `/social-accounts`  
**API:** `/api/integrations/n8n/provision`, `/api/social-accounts`

**Đang hoạt động:**
- Kết nối LinkedIn qua OAuth 2.0
- Kết nối Facebook/Instagram qua Access Token (manual)
- Mỗi platform chỉ cho phép 1 account (kết nối mới tự động thay thế cũ)
- Default mode:
  - LinkedIn → OAuth (bắt buộc)
  - Facebook/Instagram → Token (bắt buộc)
- Tạo n8n workflow riêng cho mỗi user khi connect account
- Xóa workflow khi delete account

**Cần cải thiện:**
- Migrate Facebook/Instagram sang OAuth (hiện chỉ dùng manual token)
- Token refresh tự động cho LinkedIn (hiện token expire sau 60 ngày)
- Instagram Business Account support
- Twitter/X integration

---

### 3. Content Creation with AI
**Trang:** `/content-creation`  
**API:** `/api/content/generate/proxy`, `/api/posts`, `/api/drafts`

**Đang hoạt động:**
- Generate content với OpenAI GPT
- AI image generation (DALL-E) với auto-transfer sang R2
- Chọn tone (chuyên nghiệp, thân thiện, sáng tạo...)
- Chọn độ dài (ngắn, trung bình, dài)
- Multi-platform selection
- Lưu draft
- Đăng ngay (publish now)
- Lên lịch đăng bài (schedule)
- Admin-only "Ping workflow" button để test

**Flow AI Image:**
1. AI tạo ảnh → trả về URL tạm thời
2. User bấm "Lưu nháp" hoặc "Đăng bài"
3. Hệ thống tự động download ảnh từ URL AI
4. Upload lên R2 storage
5. Lưu URL R2 vào database (không lưu URL AI)

**Cần cải thiện:**
- Preview trước khi đăng
- Edit content sau khi AI generate
- Template library
- Batch generation (nhiều bài cùng lúc)

---

### 4. Archive & Content Management
**Trang:** `/archive`, `/archive/[id]`  
**API:** `/api/contents`, `/api/contents/[id]`, `/api/drafts/[id]`

**Đang hoạt động:**
- Tab "Published": danh sách bài đã đăng (read-only)
- Tab "Draft": danh sách bản nháp (có thể edit)
- Content preview với line-clamp-2 (không hiển thị ảnh ở list)
- Detail page:
  - Published → read-only view (title, content, hashtags, platforms, images, ngày đăng)
  - Draft → edit form (có thể sửa và lưu)

**Cần cải thiện:**
- Tab "High Performance" (analytics)
- Tab "Analytics" (detailed metrics)
- Search/filter functionality
- Bulk actions (delete nhiều, export)

---

### 5. Scheduler (Background Worker)
**File:** `scheduler/index.ts`  
**API:** `/api/schedule`

**Đang hoạt động:**
- Cron job chạy mỗi phút kiểm tra scheduled posts
- Auto-publish khi đến giờ
- Retry với backoff (1m → 5m → 15m) tối đa 3 lần
- Lưu log mỗi lần thực thi (ScheduledPostAttempt)

**Chạy worker:**
```bash
npm run scheduler
```

**Cần cải thiện:**
- Recurrence (đăng lặp lại theo lịch)
- Email/webhook notification khi fail
- UI quản lý scheduled posts
- Timezone support (hiện chỉ UTC)

---

### 6. Media Storage (Cloudflare R2)
**API:** `/api/uploads`, `/api/media/transfer`

**Đang hoạt động:**
- Upload file thủ công lên R2
- Auto-transfer AI images từ external URLs sang R2
- Public URLs với custom domain hoặc R2 default URL
- Filename unique: `uploads/YYYY-MM-DD/uuid-filename.ext`

**Env vars cần thiết:**
```
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=media
R2_PUBLIC_BASE_URL=https://media.example.com  # Optional custom domain
```

**Cần cải thiện:**
- Image validation (size, aspect ratio)
- Cleanup cron job (xóa media không còn dùng)
- CDN caching
- Presigned URLs cho private content

---

## Chức năng Chưa Hoạt động (UI Only)

### 1. Brand Analysis (`/brand-analysis`)
- UI đã có nhưng chưa kết nối backend
- Mục đích: Phân tích chân dung thương hiệu, đối thủ

### 2. CMS (`/cms`)
- UI đã có nhưng chưa kết nối backend
- Mục đích: Content management tập trung

### 3. Performance Management (`/performance-management`)
- UI đã có nhưng chưa kết nối backend
- Mục đích: Analytics, báo cáo hiệu suất

### 4. AI Representative (`/ai-representative`)
- UI đã có nhưng chưa kết nối backend
- Mục đích: Tạo AI Avatar, Voice AI, Video AI

---

## Database Schema (Prisma)

### Models chính:

**User**
- Lưu thông tin người dùng, role (USER/ADMIN)
- Quan hệ: 1:N với SocialAccount, Content, ScheduledPost

**SocialAccount**
- Tài khoản mạng xã hội đã kết nối
- Platform: facebook, instagram, linkedin, twitter
- Lưu credential, webhook URL, follower count
- Status: ACTIVE, INACTIVE, EXPIRED

**Content**
- Nội dung (draft, scheduled, published)
- Fields: title, content, hashtags[], platforms[], media[]
- Status: DRAFT, SCHEDULED, PUBLISHED, ARCHIVED

**ScheduledPost**
- Job lên lịch đăng bài
- scheduledAt (UTC), timezone gốc
- Status: PENDING, PROCESSING, SUCCESS, ERROR, CANCELLED
- Retry metadata: attemptCount, nextRetryAt

**ScheduledPostAttempt**
- Log mỗi lần thực thi ScheduledPost
- executionId (từ n8n), platformResults (JSON)

**ContentPublication**
- Bản ghi publish từng content lên 1 SocialAccount
- externalPostId (ID từ Facebook/LinkedIn API)
- attemptCount, lastAttemptAt

**Analytics**
- Daily metrics per SocialAccount
- views, likes, shares, comments, reach

---

## Environment Variables

File `.env` cần các biến sau:

### Database
```
DATABASE_URL="postgresql://user:pass@localhost:5432/ai_marketing_engine"
# Để trống nếu dùng mock authentication
```

### Authentication
```
JWT_SECRET="your-super-secret-key-change-in-production"
```

### n8n Integration
```
N8N_API_BASE_URL="http://localhost:5678/api/v1"
N8N_API_KEY="your-n8n-api-key"
N8N_BASE_URL="http://localhost:5678"
N8N_TEMPLATE_WORKFLOW_ID="workflow-id-to-clone"
```

### LinkedIn OAuth
```
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"
LINKEDIN_REDIRECT_URI="http://localhost:3000/api/auth/linkedin/callback"
```

### Cloudflare R2
```
R2_ACCOUNT_ID="xxxxxxxxxxxxxxxxxxxx"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="media"
R2_PUBLIC_BASE_URL="https://media.example.com"  # Optional
```

### OpenAI (AI Generation)
```
OPENAI_API_KEY="sk-..."
```

---

## Cách Chạy Dự Án

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Setup Database (Optional)
Nếu không setup database, hệ thống sẽ dùng mock authentication tự động.

```bash
# Tạo database PostgreSQL
# Cập nhật DATABASE_URL trong .env

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed demo data (optional)
npm run db:seed
```

### 3. Chạy Development Server
```bash
npm run dev
```

Ứng dụng chạy tại: http://localhost:3000

### 4. Chạy Scheduler Worker (Riêng biệt)
```bash
npm run scheduler
```

Giữ terminal này chạy song song với dev server.

---

## Các Scripts Hữu Ích

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build production
npm start                  # Start production server
npm run lint               # Run ESLint

# Database
npm run db:generate        # Generate Prisma client
npm run db:push            # Push schema (dev)
npm run db:migrate         # Run migrations (production)
npm run db:seed            # Seed demo data
npm run db:studio          # Open Prisma Studio GUI

# Scheduler
npm run scheduler          # Run background worker
```

---

## Deployment Notes

### Cần deploy 2 services:

1. **Main App (Next.js)**
   - Build: `npm run build`
   - Start: `npm start`
   - Port: 3000

2. **Scheduler Worker**
   - Start: `npm run scheduler`
   - Chạy độc lập như background service

### Production Deployment với PM2 & Nginx

#### Bước 1: Cài đặt PM2
```bash
npm install -g pm2
```

#### Bước 2: Tạo file PM2 ecosystem config

Tạo file `ecosystem.config.js` ở root project:

```javascript
module.exports = {
  apps: [
    {
      name: 'ai-marketing-app',
      script: 'npm',
      args: 'start',
      cwd: '/path/to/AI-Automation',
      instances: 2,                    // Số instances (cluster mode)
      exec_mode: 'cluster',            // Cluster mode cho load balancing
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/app-error.log',
      out_file: './logs/app-out.log',
      time: true,
    },
    {
      name: 'ai-marketing-scheduler',
      script: 'npm',
      args: 'run scheduler',
      cwd: '/path/to/AI-Automation',
      instances: 1,                    // Chỉ 1 instance cho scheduler
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/scheduler-error.log',
      out_file: './logs/scheduler-out.log',
      time: true,
    },
  ],
}
```

#### Bước 3: Build & Start với PM2

```bash
# Build production
npm run build

# Start tất cả apps
pm2 start ecosystem.config.js

# Lưu PM2 process list
pm2 save

# Setup PM2 startup (khởi động cùng server)
pm2 startup
# Copy và chạy command mà PM2 trả về

# Các lệnh PM2 hữu ích:
pm2 list                    # Xem danh sách processes
pm2 logs                    # Xem logs realtime
pm2 logs ai-marketing-app   # Logs của app cụ thể
pm2 restart all             # Restart tất cả
pm2 reload all              # Reload (zero-downtime)
pm2 stop all                # Stop tất cả
pm2 delete all              # Xóa tất cả processes
pm2 monit                   # Monitoring dashboard
```

#### Bước 4: Cài đặt Nginx

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install nginx
```

**CentOS/RHEL:**
```bash
sudo yum install nginx
```

#### Bước 5: Cấu hình Nginx

Tạo file `/etc/nginx/sites-available/ai-marketing`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS (sau khi có SSL)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files optimization (optional)
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    # Client body size (cho upload files)
    client_max_body_size 10M;
}
```

#### Bước 6: Enable Nginx site

```bash
# Tạo symbolic link
sudo ln -s /etc/nginx/sites-available/ai-marketing /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Enable Nginx tự khởi động
sudo systemctl enable nginx
```

#### Bước 7: Setup SSL với Let's Encrypt (Khuyến nghị)

```bash
# Cài Certbot
sudo apt install certbot python3-certbot-nginx  # Ubuntu/Debian
# hoặc
sudo yum install certbot python3-certbot-nginx  # CentOS

# Lấy SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Certbot sẽ tự động cập nhật Nginx config
# Auto-renewal đã được setup sẵn
```

Nginx config sau khi có SSL sẽ tự động có thêm:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # ... phần proxy_pass như trên ...
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

#### Bước 8: Tạo thư mục logs

```bash
mkdir -p logs
```

### Deployment Checklist:

- [ ] Build Next.js: `npm run build`
- [ ] Cấu hình `.env` với production values
- [ ] Tạo `ecosystem.config.js`
- [ ] Start PM2: `pm2 start ecosystem.config.js`
- [ ] PM2 save & startup: `pm2 save && pm2 startup`
- [ ] Cài Nginx
- [ ] Cấu hình Nginx reverse proxy
- [ ] Test Nginx: `sudo nginx -t`
- [ ] Enable & reload Nginx
- [ ] Setup SSL với Certbot
- [ ] Test trên domain thật
- [ ] Setup database backups
- [ ] Setup log rotation
- [ ] Configure firewall (allow port 80, 443)

### Monitoring & Maintenance:

```bash
# PM2 monitoring
pm2 monit                   # Real-time dashboard
pm2 logs --lines 100        # Xem 100 dòng logs cuối

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Restart services
pm2 reload all              # Zero-downtime reload
sudo systemctl reload nginx # Nginx reload

# Check process
pm2 status
sudo systemctl status nginx
```

### Khuyến nghị Production:
- Database backups tự động (daily)
- Log rotation (logrotate cho Nginx, PM2 built-in)
- Monitoring alerts (PM2 Plus, Datadog, New Relic)
- CDN cho static assets (Cloudflare, AWS CloudFront)
- Firewall rules (ufw, iptables)
- Regular security updates

---

## Roadmap Phát triển

### Ngắn hạn (1-2 tháng)
- [ ] Migrate Facebook/Instagram sang OAuth
- [ ] LinkedIn token auto-refresh
- [ ] Archive: tab Analytics & High Performance
- [ ] Content preview trước khi đăng
- [ ] Template library cho content
- [ ] Search/filter trong Archive

### Trung hạn (3-6 tháng)
- [ ] Brand Analysis backend implementation
- [ ] Performance Management backend
- [ ] Recurrence scheduling (đăng lặp)
- [ ] Email notifications cho scheduled posts
- [ ] Bulk actions trong Archive
- [ ] Instagram Business Account support

### Dài hạn (6-12 tháng)
- [ ] AI Avatar backend (Voice AI, Video AI)
- [ ] Multi-user workspace (team collaboration)
- [ ] Advanced analytics & reporting
- [ ] A/B testing cho content
- [ ] Content calendar view
- [ ] Mobile app (React Native)

---

## Troubleshooting

### 1. Database connection error
- Kiểm tra PostgreSQL đã chạy chưa
- Verify DATABASE_URL trong `.env`
- Nếu không cần DB, để trống DATABASE_URL (dùng mock)

### 2. Auth không hoạt động
- Check JWT_SECRET trong `.env`
- Xóa cookie `auth-token` trong browser
- Verify middleware.ts cho protected routes

### 3. Build errors
- Chạy `npm run db:generate` trước khi build
- Xóa folder `.next` và build lại
- Check TypeScript errors với `npm run lint`

### 4. Scheduler không chạy
- Kiểm tra DATABASE_URL (scheduler cần DB)
- Check log output của worker
- Verify scheduled posts có status PENDING

### 5. AI image không lưu
- Check R2 env vars đã cấu hình đúng chưa
- Log console để thấy error từ `/api/media/transfer`
- Fallback: hệ thống giữ URL gốc nếu transfer fail

### 6. n8n provisioning fail
- Verify N8N_API_KEY và N8N_API_BASE_URL
- Check n8n đang chạy tại N8N_BASE_URL
- Template workflow (N8N_TEMPLATE_WORKFLOW_ID) phải tồn tại

---

## Security Considerations

### Đã implement:
- JWT với HTTP-only cookies (không expose token cho JS)
- Role-based access control (Admin/User)
- Protected API routes (check authentication)
- Middleware cho protected pages
- Password hashing với bcrypt
- CORS configuration

### Cần cải thiện:
- Rate limiting cho API endpoints
- Input validation & sanitization
- SQL injection prevention (Prisma đã handle)
- XSS protection
- CSRF tokens
- Security headers (helmet.js)

---

## Testing Strategy (Chưa có)

### Unit Tests
- Cần viết tests cho:
  - Auth helpers (JWT validation)
  - LinkedIn OAuth flow
  - Media transfer logic
  - Scheduler retry logic

### Integration Tests
- API endpoints testing
- Database operations
- n8n workflow creation

### E2E Tests
- Login flow
- Content creation flow
- Publishing flow
- Archive browsing

**Khuyến nghị:** Dùng Jest + Testing Library cho unit/integration, Playwright cho E2E

---

## Contributing Guidelines

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Naming conventions:
  - Components: PascalCase
  - Functions: camelCase
  - Files: kebab-case hoặc PascalCase (components)

### Git Workflow
```bash
# Tạo feature branch
git checkout -b feature/ten-tinh-nang

# Commit với message rõ ràng
git commit -m "feat: thêm chức năng X"

# Push và tạo Pull Request
git push origin feature/ten-tinh-nang
```

### Commit Message Format
```
feat: Thêm tính năng mới
fix: Sửa lỗi
docs: Cập nhật tài liệu
refactor: Tái cấu trúc code
test: Thêm/sửa tests
chore: Cập nhật dependencies, config
```

---

## Contact & Support

**Developer hiện tại:** [Tên của bạn]  
**Email:** [Email của bạn]  
**Repository:** https://github.com/KeHamTruyen/AI-Automation

**Ghi chú cho developer tiếp theo:**
- Đọc kỹ phần "Chức năng Đang Hoạt động" và "Chức năng Chưa Hoạt động"
- Test kỹ authentication flow trước khi làm features khác
- Scheduler worker PHẢI chạy riêng để scheduled posts hoạt động
- AI image auto-transfer là tính năng quan trọng, đừng bỏ qua
- Mock authentication rất hữu ích cho testing, không cần setup DB
- Đọc `prisma/schema.prisma` để hiểu database schema
- Check `.env.example` để biết env vars cần thiết

**Good luck và have fun coding!**

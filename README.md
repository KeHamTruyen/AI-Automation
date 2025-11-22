# AI Marketing Engine

_Một nền tảng marketing AI toàn diện được xây dựng với Next.js 14, TypeScript, và PostgreSQL_

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2014-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

## 🚀 Overview

AI Marketing Engine là một nền tảng marketing tự động hoàn chỉnh, tích hợp AI để giúp doanh nghiệp quản lý và tối ưu hóa các hoạt động marketing trên nhiều kênh social media.

## ✨ Features

### 🏠 **Core Pages**

- **Home** (`/`) - Landing page với tổng quan tính năng
- **Dashboard** (`/dashboard`) - Tổng quan hiệu suất và thống kê
- **Login** (`/login`) - Xác thực người dùng với JWT

### 🤖 **AI-Powered Tools**

- **AI Representative** (`/ai-representative`) - Tạo AI Avatar, Voice AI, Video AI
- **Content Creation** (`/content-creation`) - Tạo nội dung với AI
- **Brand Analysis** (`/brand-analysis`) - Phân tích thương hiệu và đối thủ

### 📊 **Management Features**

- **Social Accounts** (`/social-accounts`) - Quản lý tài khoản mạng xã hội
- **CMS** (`/cms`) - Quản lý nội dung
- **Performance Management** (`/performance-management`) - Theo dõi hiệu suất
- **Archive** (`/archive`) - Lưu trữ và quản lý dữ liệu

## 🛠️ Tech Stack

### **Frontend**

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React Query

### **Backend**

- **API**: Next.js API Routes
- **Authentication**: JWT + HTTP-only cookies
- **Middleware**: Route protection và authorization

### **Database**

- **ORM**: Prisma
- **Database**: PostgreSQL
- **Models**: User, SocialAccount, Content, Analytics

### **AI Integration**

- **OpenAI SDK**: AI content generation
- **Voice AI**: Text-to-speech capabilities
- **AI Avatar**: Virtual representative creation

## 🏗️ Project Structure

\`\`\`
├── app/                          # Next.js App Router
│   ├── api/                      # API endpoints
│   │   ├── auth/                 # Authentication routes
│   │   ├── content/              # Content management
│   │   └── social-accounts/      # Social media integration
│   ├── login/                    # Login page
│   ├── dashboard/                # Main dashboard
│   ├── ai-representative/        # AI tools
│   └── [other-pages]/            # Feature pages
├── components/                   # Reusable UI components
├── lib/                          # Utilities và configurations
│   ├── prisma.ts                 # Database client
│   ├── api.ts                    # API client
│   └── utils.ts                  # Helper functions
├── prisma/                       # Database schema và migrations
│   ├── schema.prisma             # Database models
│   └── seed.ts                   # Demo data seeding
├── middleware.ts                 # Route protection
└── public/                       # Static assets
\`\`\`

## 🚀 Quick Start

### 1. **Clone Repository**

\`\`\`bash
git clone <repository-url>
cd AI-Automation
\`\`\`

### 2. **Install Dependencies**

\`\`\`bash
npm install
\`\`\`

### 3. **Database Setup (Choose One)**

#### 🚀 Option A: Mock Data (RECOMMENDED FOR TESTING)

\`\`\`bash
# No database required! Set in .env:
DATABASE_URL=""

# System will automatically use mock data with demo accounts:
# Admin: admin@company.com / admin123
# User: user@company.com / user123
\`\`\`

#### 🐘 Option B: PostgreSQL (Production Ready)

\`\`\`bash
# 1. Install PostgreSQL
# 2. Create database: ai_marketing_engine
# 3. Update .env:
DATABASE_URL="postgresql://username:password@localhost:5432/ai_marketing_engine"

# 4. Setup database
npm run db:generate
npm run db:push
npm run db:seed
\`\`\`

#### 🛠️ Option C: Auto Setup Script

\`\`\`bash
# Windows
setup-db.bat

# Linux/macOS
chmod +x setup-db.sh && ./setup-db.sh
\`\`\`

### 4. **Start Development Server**

\`\`\`bash
npm run dev
\`\`\`

🎉 **Application will be available at: http://localhost:3000**

## 🔑 Demo Credentials

**Admin Account:**

- Email: `admin@company.com`
- Password: `admin123`

**User Account:**

- Email: `user@company.com`
- Password: `user123`

## 📜 Available Scripts

### **Development**

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm run lint        # Run ESLint
\`\`\`

### **Database**

\`\`\`bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database (dev)
npm run db:migrate   # Run migrations (production)
npm run db:seed      # Seed demo data
npm run db:studio    # Open Prisma Studio
\`\`\`

## 🗄️ Database Setup

Xem chi tiết trong [`DATABASE_SETUP.md`](./DATABASE_SETUP.md) để:

- Cài đặt PostgreSQL
- Cấu hình database connection
- Chạy migrations và seeding
- Troubleshooting thông thường

## 🔐 Authentication & Authorization

- **JWT-based authentication** với HTTP-only cookies
- **Role-based access control** (Admin/User)
- **Protected routes** với middleware
- **Automatic token refresh** và logout

## 🤖 AI Integration Features

- **Content Generation**: OpenAI GPT integration
- **AI Avatar Creation**: Virtual brand representatives
- **Voice AI**: Text-to-speech capabilities
- **Smart Analytics**: AI-powered insights

## 📚 Additional Resources

### **AI Prompt Guide**

Xem [`AI-Prompt-Usage-Guide.md`](./AI-Prompt-Usage-Guide.md) để học:

- Cấu trúc prompt hiệu quả (role, context, task, format, constraints)
- Ví dụ prompt cho marketing, coding, content writing
- Tips tối ưu hóa kết quả khi làm việc với AI

### **API Documentation**

- Authentication endpoints: `/api/auth/*`
- Content management: `/api/content/*`
- Social accounts: `/api/social-accounts/*`

## 🔄 n8n Per-User Workflows

This project can provision a dedicated n8n workflow and credential per connected social account. Ensure these environment variables are set in `.env` (copy from `.env.example`) and restart the dev server:

- `N8N_API_BASE_URL` e.g. `http://localhost:5678/api/v1` (Public API base; use `/api/v1` for API key auth)
- `N8N_API_KEY` your n8n API key (Settings → API)
- `N8N_BASE_URL` e.g. `http://localhost:5678` (used to build webhook URLs)
- `N8N_TEMPLATE_WORKFLOW_ID` the workflow ID of the template to clone for each user

Provisioning endpoint: `POST /api/integrations/n8n/provision`

Payloads:

- Token mode
  - `{ platform, name, username, mode: "token", accessToken }`
- BYO mode (client credentials only)
  - `{ platform, name, username, mode: "byo", clientId, clientSecret }`

Notes:

- BYO currently stores client_id/client_secret in an n8n credential but does not run OAuth token exchange yet.
- If you see 401/500 errors when provisioning, verify env vars and that `N8N_API_BASE_URL` points to the Public API (`/api/v1`). Using `/rest` with API keys typically yields 401 unless session cookies are present.

### OAuth follow-up (next steps)
## 📦 Cloudflare R2 Media Storage

Ảnh/media dùng để đăng bài qua Facebook/Instagram cần URL HTTPS công khai (không phải localhost). Dự án hỗ trợ lưu trữ trên Cloudflare R2 (S3-compatible) thay cho thư mục `public/uploads` cục bộ.

### Env vars bắt buộc

```
R2_ACCOUNT_ID=xxxxxxxxxxxxxxxxxxxx
R2_ACCESS_KEY_ID=***
R2_SECRET_ACCESS_KEY=***
R2_BUCKET_NAME=media
R2_PUBLIC_BASE_URL=https://media.example.com    # Custom domain đã gắn vào bucket (khuyến nghị cho production)
R2_PUBLIC_DEV_URL=https://pub-xxxx.r2.dev       # Development public URL (rate-limited, optional)
```

Nếu không cấu hình `R2_PUBLIC_BASE_URL`, mã sẽ fallback về dạng URL mặc định: `https://<account_id>.r2.cloudflarestorage.com/<bucket>/<key>`.

### Cách hoạt động

- API `POST /api/uploads` nhận `formData(file)` và thực hiện `PutObject` lên R2.
- Trả về JSON `{ success: true, url, key }` thay vì `{ path }` cũ.
- Frontend tự động dùng `data.url` nếu có; fallback sang `data.path` cho tương thích ngược.

### Ưu tiên URL

1. Nếu có `R2_PUBLIC_BASE_URL` (custom domain) → dùng domain đó.
2. Nếu không có custom domain nhưng có `R2_PUBLIC_DEV_URL` → dùng URL dev (`pub-...r2.dev`).
3. Nếu cả hai không có → fallback endpoint mặc định `https://<account_id>.r2.cloudflarestorage.com/<bucket>/<key>`.

### Quy ước object key

`uploads/<YYYY-MM-DD>/<uuid>-<sanitized-filename>` giúp dễ tổ chức, thuận lợi cho việc dọn dẹp sau này.

### Lưu ý cho Facebook/Instagram

- Ảnh phải tải được trực tiếp (status 200, đúng `Content-Type`).
- Nên kiểm soát loại file (`image/jpeg`, `image/png`) và dung lượng hợp lý (< 5MB).
- Instagram Graph API có giới hạn tỷ lệ (aspect ratio) khuyến nghị; tránh ảnh quá ngang hoặc quá dọc.

### Mở rộng tương lai

- Thêm xác thực kích thước/tỷ lệ trước khi upload.
- Chính sách dọn rác định kỳ (cron) cho media cũ không còn tham chiếu.
- Tuỳ chọn tạo presigned URL thay vì public nếu cần giới hạn truy cập tạm thời (không cần thiết cho social posting).

> Nếu thấy log cảnh báo `[r2] Missing R2 env vars`, nghĩa là server chưa được cấu hình R2 và upload sẽ lỗi.

### Mô hình file môi trường
-## ⏱ Scheduler (Lên lịch đăng bài)

Hệ thống sử dụng một worker Node riêng để xử lý các bài viết đã lên lịch.

### Cấu trúc DB (Prisma)

- `ScheduledPost`: lưu nội dung, thời gian chạy (UTC), timezone gốc, danh sách nền tảng, trạng thái (`PENDING|PROCESSING|SUCCESS|ERROR|CANCELED`), số lần thử.
- `ScheduledPostAttempt`: log mỗi lần thực thi (thành công hoặc lỗi) với executionId từ n8n.

### Luồng chạy
1. FE gọi `POST /api/schedule` tạo job (status=PENDING).
2. Worker (`npm run scheduler`) cron mỗi phút chọn job đến hạn.
3. Gửi payload tới endpoint publish (mặc định `/api/posts`).
4. Cập nhật trạng thái thành `SUCCESS` hoặc retry với backoff (1m → 5m → 15m) cho tới 3 lần.
5. Người dùng có thể hủy (`POST /api/schedule/:id/cancel`) hoặc chạy ngay (`POST /api/schedule/:id/run-now`).

### Chạy worker

```bash
npm run scheduler
```

Giữ tiến trình này chạy song song với `npm run dev` hoặc deploy thành service riêng.

### Biến môi trường tùy chọn
- `SCHEDULER_PUBLISH_ENDPOINT` nếu muốn đổi URL publish mặc định.

### Mở rộng
- Recurrence qua trường `recurrenceRule` (RRULE) – chưa triển khai.
- Thêm cảnh báo email / webhook khi job lỗi cuối cùng.


- Commit: chỉ commit `.env.example` (template, không chứa secret).
- Runtime: tạo file `.env` bằng cách copy từ `.env.example` rồi điền giá trị thật (file này bị ignore do rule `/.env*` trừ `.env.example`).
- Không dùng `.env.local` trong repo này để giảm trùng lặp.


- Add OAuth start/callback routes per platform to complete authorization.
- Exchange client credentials for access/refresh tokens and store them securely (prefer n8n credentials with encryption).
- Update the per-user workflow to use platform-specific nodes/credentials when available.

## �🐛 Troubleshooting

### **Common Issues**

1. **Database connection error**: Kiểm tra PostgreSQL và DATABASE_URL
2. **Auth not working**: Verify JWT_SECRET trong .env
3. **Build errors**: Run `npm run db:generate` trước khi build

### **Development Tips**

- Sử dụng `npm run db:studio` để xem database
- Check middleware.ts cho protected routes
- Monitor console cho API errors

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Next.js, TypeScript, and AI technologies**

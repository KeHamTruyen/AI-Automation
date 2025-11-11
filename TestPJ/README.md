# Multi-Platform Social Media Poster

MVP cho công cụ đăng bài lên nhiều nền tảng mạng xã hội với một nút bấm duy nhất.

## 🚀 Tính năng

- **Đăng đa nền tảng**: Facebook Pages, LinkedIn, Twitter với một lần nhấp
- **OAuth Authentication**: Kết nối an toàn với các tài khoản mạng xã hội
- **Upload hình ảnh**: Hỗ trợ đăng kèm hình ảnh
- **Queue System**: Xử lý bài đăng không đồng bộ
- **Dashboard**: Giao diện quản lý đơn giản và trực quan

## 🏗️ Kiến trúc

\`\`\`
Frontend (Next.js + TypeScript + Tailwind CSS)
├── Dashboard - Giao diện tạo bài đăng
├── Platform Connections - Kết nối tài khoản
└── Post History - Lịch sử bài đăng

Backend (Node.js + Express)
├── OAuth Routes - Xác thực người dùng
├── Post API - Tạo và quản lý bài đăng
├── Queue System - Xử lý bài đăng bất đồng bộ
└── Platform Adapters - Tích hợp với từng nền tảng
\`\`\`

## 📋 Yêu cầu hệ thống

- Node.js 16+
- Redis (cho queue system)
- MongoDB (tùy chọn cho lưu trữ dữ liệu)

## ⚙️ Cài đặt

### 1. Clone dự án

\`\`\`bash
git clone <repository-url>
cd multi-platform-poster
\`\`\`

### 2. Cài đặt dependencies

\`\`\`bash
npm run install-all
\`\`\`

### 3. Thiết lập OAuth Apps & Environment Variables

#### Quick Setup Script

\`\`\`bash
# Windows
setup-oauth.bat

# Linux/Mac
./setup-oauth.sh
\`\`\`

#### Manual Setup

\`\`\`bash
cd server
cp .env.example .env
\`\`\`

Sau đó follow hướng dẫn chi tiết:

📖 **Setup Guides:**

- [Facebook OAuth Setup](docs/facebook-setup.md) - **Khuyến nghị bắt đầu với này** (Free & dễ nhất)
- [LinkedIn OAuth Setup](docs/linkedin-setup.md) - Free, cần app review
- [Twitter OAuth Setup](docs/twitter-setup.md) - **Paid API** ($100/month minimum)

#### Environment Variables Template:

\`\`\`env
# Facebook (Free - Khuyến nghị setup trước)
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# LinkedIn (Free - Cần app review)
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Twitter (Paid API - Setup sau)
TWITTER_CONSUMER_KEY=your-twitter-consumer-key
TWITTER_CONSUMER_SECRET=your-twitter-consumer-secret

# Optional Services
MONGODB_URI=mongodb://localhost:27017/multiplatform-poster
REDIS_URL=redis://localhost:6379
\`\`\`

### 4. Khởi động services

#### Khởi động Redis (Windows)

\`\`\`bash
# Tải và cài đặt Redis từ https://redis.io/download
redis-server
\`\`\`

#### Khởi động MongoDB (tùy chọn)

\`\`\`bash
mongod
\`\`\`

### 5. Chạy ứng dụng

\`\`\`bash
npm run dev
\`\`\`

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔑 Thiết lập OAuth Apps

### Facebook App

1. Truy cập [Facebook Developers](https://developers.facebook.com/)
2. Tạo app mới
3. Thêm "Facebook Login" product
4. Thêm redirect URI: `http://localhost:5000/api/auth/facebook/callback`
5. Yêu cầu quyền: `pages_manage_posts`, `pages_read_engagement`

### LinkedIn App

1. Truy cập [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Tạo app mới
3. Thêm redirect URI: `http://localhost:5000/api/auth/linkedin/callback`
4. Yêu cầu quyền: `r_liteprofile`, `w_member_social`

### Twitter App

1. Truy cập [Twitter Developer Portal](https://developer.twitter.com/)
2. Tạo app mới
3. Thiết lập OAuth 1.0a
4. Thêm callback URL: `http://localhost:5000/api/auth/twitter/callback`

## 📝 Cách sử dụng

1. **Kết nối tài khoản**: Truy cập Dashboard và kết nối các tài khoản mạng xã hội
2. **Tạo bài đăng**: Nhập nội dung, chọn hình ảnh (tùy chọn)
3. **Chọn nền tảng**: Tick các nền tảng muốn đăng
4. **Đăng bài**: Nhấn "Post to Selected Platforms"

## 🔧 API Endpoints

### Authentication

- `GET /api/auth/facebook` - Facebook OAuth
- `GET /api/auth/linkedin` - LinkedIn OAuth
- `GET /api/auth/twitter` - Twitter OAuth
- `GET /api/auth/profile` - Lấy thông tin user
- `POST /api/auth/logout` - Đăng xuất

### Posts

- `POST /api/posts/create` - Tạo bài đăng mới
- `GET /api/posts/status/:postId` - Kiểm tra trạng thái bài đăng
- `GET /api/posts/history` - Lịch sử bài đăng

## 🚧 Tính năng trong development

- [ ] Scheduling posts
- [ ] Instagram integration
- [ ] Advanced analytics
- [ ] Team collaboration
- [ ] Template library
- [ ] Bulk posting from CSV

## ⚠️ Lưu ý

1. **Twitter API**: Cần subscription trả phí cho posting tự động
2. **Facebook**: Chỉ đăng được lên Pages, không đăng được lên profile cá nhân
3. **Rate Limits**: Mỗi platform có giới hạn API calls khác nhau
4. **Review Process**: Facebook và LinkedIn yêu cầu app review cho production

## 🐛 Troubleshooting

### Common Issues

1. **OAuth redirect errors**

   - Kiểm tra callback URLs trong app settings
   - Đảm bảo domain matches chính xác

2. **API permission errors**

   - Xác minh app có đủ permissions
   - Kiểm tra app review status

3. **Queue not processing**
   - Đảm bảo Redis đang chạy
   - Check Redis connection string

## 📚 Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Passport.js
- **Queue**: Bull + Redis
- **Storage**: Multer (local), có thể mở rộng với S3
- **Database**: MongoDB (tùy chọn)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

MIT License. Xem file LICENSE để biết thêm chi tiết.

## 🆘 Support

Nếu gặp vấn đề, hãy:

1. Kiểm tra [Issues](https://github.com/your-repo/issues)
2. Tạo issue mới với mô tả chi tiết
3. Include logs và error messages

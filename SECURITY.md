# 🔒 Security Guide

## ⚠️ QUAN TRỌNG: Bảo vệ credentials

### 1. **KHÔNG BAO GIỜ commit file `.env` vào git**

File `.env` chứa thông tin nhạy cảm và **ĐÃ ĐƯỢC THÊM VÀO `.gitignore`**:
```gitignore
# env files
.env*
!.env.example
```

✅ **Kiểm tra xem `.env` đã bị commit chưa:**
```bash
git ls-files | grep "\.env$"
```

❌ **Nếu đã commit nhầm, XÓA NGAY:**
```bash
# Xóa khỏi git history (NGUY HIỂM - backup trước!)
git rm --cached .env
git commit -m "Remove .env from tracking"

# Rotate ALL credentials ngay lập tức:
# - Đổi mật khẩu database
# - Regenerate R2 access keys
# - Tạo JWT_SECRET mới
# - Đổi tất cả API keys
```

### 2. **Generate JWT_SECRET mạnh**

```bash
# Generate 256-bit random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy kết quả vào `.env`:
```env
JWT_SECRET=8fd61a70b3d7f8a0bd057c1116f0b83a4530c13bc25b4e78350d673ee54d7445
```

### 3. **Quản lý credentials đúng cách**

#### Development:
- ✅ Dùng file `.env.local` (không commit)
- ✅ Copy từ `.env.example` và điền thông tin thật

#### Production (Vercel/Netlify/etc):
- ✅ Set environment variables qua dashboard
- ✅ KHÔNG upload file `.env`
- ✅ Enable "Encrypted environment variables"

### 4. **Rotate credentials định kỳ**

Thay đổi các credentials sau mỗi 90 ngày:
- [ ] JWT_SECRET
- [ ] Database password
- [ ] R2 access keys
- [ ] API keys (OpenAI, n8n, etc.)

### 5. **Security Checklist**

- [x] JWT_SECRET mạnh (256-bit)
- [x] File `.env` không bị commit
- [x] API uploads có authentication
- [x] File upload có validation (size, type)
- [x] HTTP-only cookies cho auth tokens
- [ ] Rate limiting (TODO)
- [ ] HTTPS enabled trong production
- [ ] Prisma queries parameterized (chống SQL injection)

## 🛡️ Các lớp bảo mật đã implement

### Authentication
- ✅ JWT với HTTP-only cookies
- ✅ Middleware kiểm tra auth cho protected routes
- ✅ Token expiry (24h)
- ✅ Bcrypt hash passwords

### File Upload Security
- ✅ Auth required (JWT verification)
- ✅ File size limit: 10MB
- ✅ File type whitelist: images only
- ✅ Random filename generation
- ✅ Secure path construction

### API Security
- ✅ INTERNAL_API_KEY cho n8n webhooks
- ✅ JWT verification cho user endpoints
- ✅ Input validation (email, password, etc.)
- ✅ Error messages không leak sensitive info

## 🚨 Phát hiện lỗ hổng?

Nếu bạn phát hiện lỗ hổng bảo mật, vui lòng:
1. **KHÔNG** tạo public issue
2. Email trực tiếp cho team
3. Mô tả chi tiết và cách reproduce

## 📚 Tài liệu tham khảo

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Prisma Security Best Practices](https://www.prisma.io/docs/guides/security)

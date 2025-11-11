# LinkedIn OAuth Setup Guide

## Bước 1: Tạo LinkedIn App

1. Truy cập: https://www.linkedin.com/developers/
2. Đăng nhập với tài khoản LinkedIn
3. Click "Create App"
4. Điền thông tin:
   - App name: "Multi Platform Poster"
   - LinkedIn Page: Chọn page/company (nếu có, hoặc tạo mới)
   - Privacy policy URL: `http://localhost:3000/privacy` (tạm thời)
   - App logo: Upload logo bất kỳ (optional)
5. Agree to terms và click "Create App"

## Bước 2: Cấu hình App

### 2.1 Basic Info

1. Copy "Client ID" và "Client Secret" từ tab "Auth"
2. Thêm vào file `server/.env`:
   \`\`\`
   LINKEDIN_CLIENT_ID=your-client-id-here
   LINKEDIN_CLIENT_SECRET=your-client-secret-here
   \`\`\`

### 2.2 OAuth 2.0 Redirect URLs

1. Vào tab "Auth"
2. Trong "OAuth 2.0 Redirect URLs", click "Add redirect URL"
3. Thêm: `http://localhost:5000/api/auth/linkedin/callback`
4. Click "Update"

## Bước 3: API Rate Limits & Costs

### 3.1 Rate Limits (Không công bố)

**LinkedIn KHÔNG công bố rate limits cụ thể:**

- **Check qua Developer Portal**: Analytics tab
- **Varies per endpoint**: Mỗi API có limit khác nhau
- **Reset daily**: UTC 0:00 mỗi ngày
- **Dynamic**: Có thể thay đổi theo usage

### 3.2 Cách kiểm tra limits

1. **Developer Portal** → chọn app → **Analytics**
2. **Chỉ hiển thị endpoints đã call ít nhất 1 lần**
3. **Make test call** → refresh để xem actual limits

### 3.3 OAuth Scopes cần thiết

- ✅ `r_liteprofile` - Đọc profile cơ bản (có sẵn)
- ✅ `w_member_social` - Post lên profile (cần request)

### 3.4 Chi phí

- **✅ MIỄN PHÍ** cho basic member posting
- **⚠️ Enterprise**: Có paid tiers cho volume cao

## Bước 4: App Review Process

**Cho MVP/Testing:**

- Test được ngay với developer account
- **Share on LinkedIn** product - approve nhanh
- Basic posting hoạt động ngay

**Cho Production:**

- Cần submit app review chi tiết
- Mô tả use case rõ ràng
- LinkedIn review khá strict

⚠️ **Kết luận**: LinkedIn miễn phí nhưng rate limits không rõ ràng

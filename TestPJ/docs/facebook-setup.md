# Facebook OAuth Setup Guide - HƯỚNG DẪN HOÀN CHỈNH

## ⚠️ **Quan trọng**: Bạn cần tài khoản Facebook và tạo Developer App

## 🔥 **BƯỚC 1: TẠO FACEBOOK DEVELOPER APP**

### 1.1 Truy cập Facebook Developers

1. **Truy cập**: https://developers.facebook.com/
2. **Đăng nhập** với tài khoản Facebook của bạn
3. **Click "My Apps"** (góc phải trên)

### 1.2 Tạo App mới

1. **Click "Create App"** (nút xanh)
2. **Chọn "Consumer"** → **Click "Next"**
3. **Điền thông tin**:
   - **App name**: `Multi Platform Poster` (hoặc tên bạn muốn)
   - **App contact email**: email của bạn
   - **Business account**: có thể bỏ trống
4. **Click "Create App"**
5. **Xác nhận security check** (nếu có)

## 🔥 **BƯỚC 2: LẤY API CREDENTIALS**

### 2.1 Copy App ID và App Secret

1. **Vào "App Settings"** → **"Basic"** (sidebar trái)
2. **Copy "App ID"**
3. **Click "Show"** bên cạnh "App Secret" → **Copy "App Secret"**
4. **Paste vào file** `server/.env`:
   \`\`\`env
   FACEBOOK_APP_ID=1234567890123456
   FACEBOOK_APP_SECRET=abcd1234efgh5678ijkl9012mnop3456
   \`\`\`

### 2.2 Cấu hình App Domains (Development)

1. **Vẫn ở trang "Basic"**
2. **Scroll xuống tìm "App Domains"**
3. **Thêm**: `localhost`
4. **Tìm "Site URL"** → **Thêm**: `http://localhost:3000`
5. **Click "Save Changes"**

## 🔥 **BƯỚC 3: SETUP FACEBOOK LOGIN**

### 3.1 Kích hoạt Facebook Login

1. **Vào "Use Cases"** (sidebar trái)
2. **Tìm "Authenticate and request data from users"**
3. **Click "Customize"**
4. **Nếu chưa có, click "Add"** để thêm use case này

### 3.2 Cấu hình OAuth Redirect (Chỉ cho Production)

✅ **Development Mode**: Facebook tự động cho phép `localhost` redirect

**Cho Production sau này**:

1. **Vào "Use Cases"** → **"Authenticate and request data from users"** → **"Settings"**
2. **Tìm "Valid OAuth Redirect URIs"**
3. **Thêm**: `https://yourdomain.com/api/auth/facebook/callback`

## 🔥 **BƯỚC 4: THÊM PERMISSIONS**

### 4.1 Permissions cơ bản (Không cần review)

1. **Vào "Use Cases"** → **"Authenticate and request data from users"**
2. **Click "Go to Permissions"** hoặc **"Customize"**
3. **Permissions đã có sẵn**:
   - ✅ `public_profile` - Thông tin cơ bản
   - ✅ `email` - Email (có thể bị lỗi, bỏ qua)

### 4.2 Permissions cho Pages (Cần review cho Production)

**Để post lên Facebook Pages**, cần thêm:

1. **Vào "App Review"** → **"Permissions and Features"**
2. **Tìm và click "Add to submission"** cho:
   - `pages_show_list` - Xem danh sách pages
   - `pages_read_engagement` - Đọc thông tin page
   - `pages_manage_posts` - Đăng bài lên page

⚠️ **Lưu ý**: Những permissions này cần **App Review** cho production

## 🔥 **BƯỚC 5: TẠO FACEBOOK PAGE (Bắt buộc)**

### 5.1 Tạo Page để test

1. **Truy cập**: https://www.facebook.com/pages/create
2. **Chọn loại page** (Business, Community, etc.)
3. **Điền thông tin**:
   - **Page name**: `Test Page Multi Platform`
   - **Category**: `Software`
   - **Description**: `Page for testing multi-platform posting`
4. **Click "Create Page"**

### 5.2 Đảm bảo quyền Admin

- **Tài khoản developer** phải là **Admin** của page
- **Kiểm tra**: Vào page → Settings → Page Roles

## 🔥 **BƯỚC 6: DEVELOPMENT MODE VS PRODUCTION**

### 6.1 Development Mode (Hiện tại)

- ✅ **App Status**: "In Development" (đỏ)
- ✅ **Chỉ developer** và test users được dùng
- ✅ **localhost** tự động được phép
- ✅ **Không cần app review** cho test

### 6.2 Production Mode (Sau này)

- **App Status**: "Live" (xanh)
- **Mọi người** có thể dùng app
- **Cần domain thật** + SSL
- **Bắt buộc app review** cho pages permissions

## 🔥 **BƯỚC 7: TEST OAUTH FLOW**

### 7.1 Test cơ bản

1. **Khởi động server**: `npm start` trong `/server`
2. **Khởi động frontend**: `npm run dev` trong `/client`
3. **Truy cập**: http://localhost:3000/dashboard
4. **Click "Connect Facebook"**
5. **Đăng nhập Facebook** → **Cho phép app**
6. **Quay lại dashboard** → Thấy "Connected as [Your Name] via facebook"

### 7.2 Test Posting (Development Mode)

1. **Viết nội dung**: "Test post from Multi Platform Poster! 🚀"
2. **Chọn Facebook**
3. **Click "Post to Selected Platforms"**
4. **Kết quả**: "Posted successfully (Development Mode)"

## 🔥 **BƯỚC 8: TROUBLESHOOTING**

### 8.1 Lỗi thường gặp

**"Invalid Scopes: email"**

- ✅ **Giải pháp**: Đã sửa code chỉ dùng `public_profile`

**"App không hoạt động"**

- ✅ **Kiểm tra**: App Status phải là "In Development"
- ✅ **Kiểm tra**: App Domains có `localhost`

**"Socket hang up" khi post**

- ✅ **Giải pháp**: Đã thêm Development Mode bypass

### 8.2 Verification checklist

- ✅ App ID và Secret đã paste vào `.env`
- ✅ App Domains có `localhost`
- ✅ Site URL có `http://localhost:3000`
- ✅ App ở Development Mode
- ✅ Đã tạo Facebook Page
- ✅ Server và Frontend đang chạy

## ✅ **KẾT QUẢ MONG ĐỢI**

Sau khi hoàn thành tất cả bước:

1. ✅ **Facebook OAuth hoạt động**
2. ✅ **Dashboard hiển thị "Connected as [Name] via facebook"**
3. ✅ **Post creation trả về success (Development Mode)**
4. ✅ **Logs hiển thị**: "📘 Facebook (DEV MODE): Would post: [content]"

**Bước tiếp theo**: Setup LinkedIn và Twitter OAuth! 🚀## ✅ **Facebook Pages API - HOÀN TOÀN MIỄN PHÍ!**

**Rate Limits:**

- **Standard**: `200 * số user active` calls/hour
- **Posting**: Unlimited posts (chỉ giới hạn API calls)
- **Pages**: Có thể post lên nhiều pages không giới hạn
- **Cost**: **$0** - Hoàn toàn miễn phí!

**Lưu ý quan trọng:**

- ✅ **Facebook Pages**: Post được unlimited, miễn phí
- ❌ **Facebook Profile cá nhân**: KHÔNG thể post qua API (bị cấm)

⚠️ **Lưu ý**: Facebook yêu cầu app review cho production, nhưng trong development mode bạn có thể test với tài khoản developer.

## Bước 4: Test Mode

- App mặc định ở "Development Mode"
- Chỉ developer và test users mới dùng được
- Để public, cần submit app review

## Bước 5: Tạo Facebook Page (nếu chưa có)

1. Truy cập: https://www.facebook.com/pages/create
2. Tạo page để test posting
3. Đảm bảo tài khoản developer có admin rights trên page

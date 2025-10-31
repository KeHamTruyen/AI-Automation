# Twitter/X OAuth Setup Guide

## 🎉 **BREAKING NEWS: X API FREE TIER CÓ THỂ POST!**

**Thông tin mới nhất từ X API (2025)**:

- **Free tier**: ✅ **100 posts/month** (MIỄN PHÍ!)
- **Basic tier ($200/month)**: ✅ 15,000 posts/month
- **Pro tier ($5,000/month)**: ✅ 1,000,000 posts/month

## 🚀 **Setup X Developer Account**

### Bước 1: Tạo Developer Account

1. **Truy cập**: https://developer.twitter.com/
2. **Đăng nhập** với tài khoản X/Twitter
3. **Sign up for developer account** (miễn phí)
4. **Chọn use case**: "Building tools for myself"
5. **Verify email** và chờ approval (thường instant)

### Bước 2: Tạo App

1. **Vào Developer Portal**: https://developer.twitter.com/en/portal/dashboard
2. **Click "Create Project"** → **"Create App"**
3. **Điền thông tin**:
   - App name: `MultiPlatformPoster`
   - Description: "Social media management tool"
   - Website: `http://localhost:3000`

### Bước 3: Lấy API Keys

1. **Vào app settings** → **"Keys and tokens"**
2. **Copy**:
   - Consumer Key (API Key)
   - Consumer Secret (API Secret)
3. **Paste vào file** `server/.env`:
   ```env
   TWITTER_CONSUMER_KEY=your-api-key-here
   TWITTER_CONSUMER_SECRET=your-api-secret-here
   ```

### Bước 4: Cấu hình OAuth

1. **Vào "Settings"** tab
2. **"User authentication settings"** → **"Set up"**
3. **Configure**:
   - App permissions: **"Read and write"**
   - Type of App: **"Web App"**
   - Callback URI: `http://localhost:5000/api/auth/twitter/callback`
   - Website URL: `https://example.com` (dùng tạm, X không chấp nhận localhost)

⚠️ **Lưu ý**: X/Twitter không chấp nhận localhost cho Website URL, dùng URL tạm thời như `https://example.com` cho development.

## ✅ **Kết luận**

**X API giờ đây thân thiện hơn nhiều!**

- Free tier: 100 posts/month - đủ cho testing
- Setup đơn giản, không cần subscription
- Perfect cho MVP và demo

Cảm ơn bạn đã correct! 🙏

### 3.1 Keys and Tokens

1. Vào tab "Keys and tokens"
2. Copy:
   - API Key (Consumer Key)
   - API Secret Key (Consumer Secret)
3. Thêm vào `server/.env`:
   ```
   TWITTER_CONSUMER_KEY=your-api-key-here
   TWITTER_CONSUMER_SECRET=your-api-secret-here
   ```

### 3.2 OAuth 1.0a Settings

1. Vào tab "App settings" → "Authentication settings"
2. Enable "OAuth 1.0a"
3. Callback URL: `http://localhost:5000/api/auth/twitter/callback`
4. Website URL: `http://localhost:3000`
5. App permissions: "Read and Write" (để có thể post)

### 3.3 Generate Access Tokens (cho testing)

1. Vào "Keys and tokens"
2. Generate "Access Token and Secret"
3. Lưu lại để test

## Bước 4: Upgrade to Paid Plan (để posting)

1. Vào "Billing" trong Developer Portal
2. Subscribe to "Basic" plan ($100/month minimum)
3. Chỉ sau khi pay mới có thể post tweets via API

## Alternative: Mock Implementation

Trong MVP, tôi đã implement mock Twitter posting:

- Không thực sự post lên Twitter
- Tạo intent URL để user có thể post manual
- Để demo flow without paying

## Bước 5: Test Implementation

```javascript
// File: server/services/adapters/twitterAdapter.js
// Đã có sẵn mock implementation
// Uncomment phần thực khi có paid API access
```

⚠️ **Khuyến nghị**:

- Bắt đầu với Facebook và LinkedIn trước (free)
- Để Twitter sau khi có budget hoặc dùng mock version

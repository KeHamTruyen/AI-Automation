# 🚀 Hướng dẫn thiết lập OAuth APIs

## ✅ **TÓM TẮT NHANH**

Bạn cần tạo **3 Developer Apps** để lấy API keys:

| Platform      | URL                                  | Thời gian | Chi phí                       |
| ------------- | ------------------------------------ | --------- | ----------------------------- |
| **Facebook**  | https://developers.facebook.com/     | 10 phút   | Miễn phí                      |
| **LinkedIn**  | https://www.linkedin.com/developers/ | 5 phút    | Miễn phí                      |
| **Twitter/X** | https://developer.twitter.com/       | 5 phút    | **100 posts/tháng MIỄN PHÍ!** |

## 🎯 **BƯỚC ĐẦU TIÊN**

1. **Chạy script setup**:

   \`\`\`bash
   # Windows
   setup-oauth.bat

   # Linux/Mac
   ./setup-oauth.sh
   \`\`\`

2. **Script sẽ**:
   - Tạo file `.env`
   - Mở hướng dẫn chi tiết
   - Copy template cần thiết

## 📋 **QUY TRÌNH CHO TỪNG PLATFORM**

### 1. Facebook (Dễ nhất - Bắt đầu đây)

1. Vào https://developers.facebook.com/
2. Tạo app → Copy App ID & Secret
3. Paste vào `server/.env`
4. ✅ **Test ngay được**

### 2. LinkedIn (Trung bình)

1. Vào https://www.linkedin.com/developers/
2. Tạo app → Copy Client ID & Secret
3. Paste vào `server/.env`
4. ⚠️ **Cần verify company để post thực tế**

### 3. Twitter/X (Dễ hơn tưởng tượng!)

1. Vào https://developer.twitter.com/
2. Tạo app → Copy Consumer Key & Secret
3. Paste vào `server/.env`
4. ✅ **FREE: 100 posts/tháng - perfect cho testing!**

## 🔧 **TEST MVP NGAY**

**Không cần đợi OAuth setup**, bạn có thể test ngay:

\`\`\`bash
npm run dev
\`\`\`

- Frontend: http://localhost:3000
- Tạo bài đăng → Sẽ hiển thị mock responses
- UI/UX hoạt động hoàn toàn bình thường

## 🎨 **Demo Mode vs Production Mode**

### Demo Mode (Hiện tại)

- ✅ UI hoàn chỉnh
- ✅ Form validation
- ✅ Upload ảnh
- ✅ Mock responses
- ❌ Không đăng thực tế

### Production Mode (Sau khi setup OAuth)

- ✅ Tất cả tính năng demo
- ✅ Đăng thực tế lên platforms
- ✅ Real responses từ APIs

## 🚀 **KHUYẾN NGHỊ**

1. **Test demo trước** → Đảm bảo logic hoạt động
2. **Setup Facebook** → Dễ nhất, unlimited posts miễn phí
3. **Setup Twitter/X** → 100 posts/tháng miễn phí - great cho testing!
4. **Setup LinkedIn** → Nếu cần business posting

## 📞 **Cần hỗ trợ?**

Check file hướng dẫn chi tiết:

- `docs/facebook-setup.md`
- `docs/linkedin-setup.md`
- `docs/twitter-setup.md`

# Instagram Integration Setup

## Overview

Instagram posting sử dụng Facebook Graph API, tương tự Facebook Pages. Workflow template đã có node "Post Instagram" sử dụng credential `facebookGraphApi`.

## Yêu cầu

1. **Facebook App** đã tạo tại [developers.facebook.com](https://developers.facebook.com)
2. **Instagram Business Account** hoặc **Instagram Creator Account** được kết nối với một Facebook Page
3. **Access Token** với các quyền:
   - `instagram_basic` (đọc profile Instagram)
   - `instagram_content_publish` (đăng bài lên Instagram)
   - `pages_read_engagement` (nếu muốn đọc metrics)
   - `pages_show_list` (liệt kê Pages)

## Các bước lấy Instagram Access Token

### 1. Tạo Facebook App

- Vào [developers.facebook.com/apps](https://developers.facebook.com/apps)
- Tạo app mới hoặc dùng app hiện có
- Thêm sản phẩm: **Instagram Basic Display** (cho đọc) và **Instagram Graph API** (cho đăng bài)

### 2. Kết nối Instagram Business Account với Facebook Page

- Mở Facebook Page của bạn → Settings → Instagram
- Kết nối Instagram Business Account (phải chuyển Instagram cá nhân sang Business/Creator trước)
- Xác nhận kết nối thành công

### 3. Lấy Access Token

Có 2 cách:

#### A. Qua Graph API Explorer (Dev mode - nhanh):

1. Vào [developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer)
2. Chọn app của bạn
3. Chọn quyền: `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`
4. Generate Access Token → đăng nhập và cấp quyền
5. Copy User Access Token (ngắn hạn, 1-2 giờ)
6. **Đổi sang Long-lived token** (60 ngày):
   ```bash
   curl -X GET "https://graph.facebook.com/v23.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_LIVED_TOKEN"
   ```
7. Lưu `access_token` trả về

#### B. Qua OAuth Flow (Production - an toàn hơn):

1. Implement OAuth flow trong app:
   ```
   https://www.facebook.com/v23.0/dialog/oauth?client_id=YOUR_APP_ID&redirect_uri=YOUR_REDIRECT_URI&scope=instagram_basic,instagram_content_publish,pages_show_list
   ```
2. User authorize → nhận `code`
3. Đổi `code` sang `access_token`:
   ```bash
   curl -X GET "https://graph.facebook.com/v23.0/oauth/access_token?client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&redirect_uri=YOUR_REDIRECT_URI&code=CODE"
   ```

### 4. Lấy Instagram Business Account ID

```bash
curl -X GET "https://graph.facebook.com/v23.0/me/accounts?fields=instagram_business_account&access_token=YOUR_TOKEN"
```

Response:

```json
{
  "data": [
    {
      "instagram_business_account": {
        "id": "17841400008460056" // <-- Đây là igUserId
      },
      "id": "123456789" // Page ID
    }
  ]
}
```

## Provision Instagram vào workflow

### API Call

```bash
curl -X POST "http://localhost:3000/api/social-accounts/instagram" \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=YOUR_JWT_TOKEN" \
  -d '{
    "accessToken": "LONG_LIVED_TOKEN",
    "displayName": "My Instagram",
    "igUserId": "17841400008460056"
  }'
```

### Response

```json
{
  "success": true,
  "workflowId": "xyz123",
  "webhookUrl": "https://n8n.example.com/webhook/user-..."
}
```

## Đăng bài lên Instagram

### Yêu cầu

- **Phải có ảnh**: Instagram không cho phép đăng text-only. Field `media` trong payload phải chứa URL ảnh công khai.
- **URL ảnh**: Phải là HTTPS, publicly accessible.

### Payload ví dụ

```json
{
  "content_text": "Chào Instagram! 🎉 #test #n8n",
  "platform": "instagram",
  "platforms": ["instagram"],
  "hashtags": ["#test", "#n8n"],
  "media": ["https://example.com/image.jpg"]
}
```

### Quy trình đăng bài Instagram qua Graph API

1. Upload ảnh và tạo container:
   ```
   POST /me/media
   {
     "image_url": "https://example.com/image.jpg",
     "caption": "My caption #hashtag"
   }
   → Trả về creation_id
   ```
2. Publish container:
   ```
   POST /me/media_publish
   {
     "creation_id": "CONTAINER_ID"
   }
   → Trả về post ID
   ```

**Lưu ý**: Workflow template hiện tại chỉ gọi bước 1. Để hoàn thiện, cần thêm node thứ 2 gọi `/me/media_publish` với `creation_id` từ response bước 1.

## Cập nhật workflow template để publish Instagram đúng

### Thay node "Post Instagram" hiện tại bằng 2 nodes:

**Node 1: Create Instagram Container**

```json
{
  "name": "Create Instagram Container",
  "type": "n8n-nodes-base.facebookGraphApi",
  "parameters": {
    "httpRequestMethod": "POST",
    "graphApiVersion": "v23.0",
    "node": "me",
    "edge": "media",
    "options": {
      "queryParameters": {
        "parameter": [
          {
            "name": "image_url",
            "value": "={{ $json.media && $json.media[0] ? $json.media[0] : '' }}"
          },
          { "name": "caption", "value": "={{ $json.content_text }}" }
        ]
      }
    }
  }
}
```

**Node 2: Publish Instagram Media**

```json
{
  "name": "Publish Instagram Media",
  "type": "n8n-nodes-base.facebookGraphApi",
  "parameters": {
    "httpRequestMethod": "POST",
    "graphApiVersion": "v23.0",
    "node": "me",
    "edge": "media_publish",
    "options": {
      "queryParameters": {
        "parameter": [{ "name": "creation_id", "value": "={{ $json.id }}" }]
      }
    }
  }
}
```

Kết nối: `Create Container` → `Publish Media` → `Normalize Result`

## Troubleshooting

### Lỗi: "The user hasn't authorized the application"

- Token thiếu scope `instagram_content_publish`
- Hoặc app chưa được add vào Business Manager của Instagram account
- Giải pháp: Re-authorize với đầy đủ scope

### Lỗi: "Invalid media object id"

- URL ảnh không accessible (private, 404, hoặc không phải HTTPS)
- Giải pháp: Dùng URL ảnh public, HTTPS, size < 8MB

### Lỗi: "OAuthException code 190"

- Token hết hạn hoặc invalid
- Giải pháp: Tạo long-lived token mới

### Post không xuất hiện trên Instagram

- Container đã tạo nhưng chưa gọi `media_publish` → post vẫn ở draft
- Giải pháp: Thêm node publish (xem phần "Cập nhật workflow" ở trên)

### App ở Development Mode

- Chỉ test được với các Instagram account được thêm vào Roles (Admin/Developer/Tester)
- Giải pháp: Thêm Instagram account vào Roles, hoặc đưa app lên Live Mode (cần App Review)

## App Review cho Instagram (nếu cần Live Mode)

1. Vào App Dashboard → App Review → Permissions and Features
2. Request:
   - `instagram_basic`
   - `instagram_content_publish`
3. Cung cấp:
   - Screencast demo app đăng bài
   - Privacy Policy URL
   - Mô tả use case
4. Đợi Facebook duyệt (thường 1-3 ngày)

## Tham khảo

- [Instagram Graph API - Publishing](https://developers.facebook.com/docs/instagram-api/guides/content-publishing)
- [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Long-lived Access Tokens](https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived)

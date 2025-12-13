# Hướng dẫn sử dụng Workflow Scheduler n8n

## Tổng quan

Workflow này thay thế `scripts/scheduler-worker.ts` bằng cách:

- Chạy cron mỗi phút trong n8n
- Đọc job từ database PostgreSQL
- Lock, publish, và cập nhật trạng thái
- Retry tự động với backoff (1m → 5m → 15m)

## Cài đặt

### 1. Import workflow vào n8n

```bash
# Truy cập n8n UI
# Vào: Workflows → Import from File
# Chọn: n8n/Scheduler Worker (Cron + DB).json
```

### 2. Cấu hình Credentials

Bạn cần tạo 2 credentials trong n8n:

#### A. PostgreSQL Database

- **Name**: `PostgreSQL - AI Automation`
- **Host**: `localhost` (hoặc IP database của bạn)
- **Port**: `5432`
- **Database**: `AI_Automation`
- **User**: `postgres`
- **Password**: (từ `.env` → `DB_PASSWORD`)

#### B. HTTP Header Auth (Internal API Key)

- **Name**: `Internal API Key`
- **Header Name**: `X-Internal-API-Key`
- **Header Value**: (từ `.env` → `INTERNAL_API_KEY`)

### 3. Cập nhật URL endpoint

Trong node **"Publish Post"**, sửa URL nếu cần:

- Dev: `http://localhost:3000/api/posts`
- Production: `https://your-domain.com/api/posts`

### 4. Activate workflow

- Bật workflow trong n8n UI
- Workflow sẽ tự động chạy mỗi phút

## Luồng hoạt động

```
┌─────────────────┐
│  Every Minute   │ ← Cron trigger
└────────┬────────┘
         ↓
┌─────────────────┐
│ Fetch Due Jobs  │ ← SELECT * FROM ScheduledPost WHERE status=PENDING AND scheduledAt<=NOW()
└────────┬────────┘
         ↓
┌─────────────────┐
│   Has Jobs?     │ ← Kiểm tra có job không
└────┬────────┬───┘
     YES      NO → [No Jobs] (end)
     ↓
┌─────────────────┐
│  Prepare Jobs   │ ← Chuẩn bị payload
└────────┬────────┘
         ↓
┌─────────────────┐
│   Lock Job      │ ← UPDATE status='PROCESSING' WHERE id=? AND status='PENDING'
└────────┬────────┘
         ↓
┌─────────────────┐
│ Lock Success?   │ ← Kiểm tra lock thành công (optimistic locking)
└────────┬────────┘
         ↓
┌─────────────────┐
│ Create Attempt  │ ← INSERT vào ScheduledPostAttempt
└────────┬────────┘
         ↓
┌─────────────────┐
│  Publish Post   │ ← POST /api/posts (gọi n8n publish workflow)
└────────┬────────┘
         ↓
┌─────────────────┐
│ Process Result  │ ← Xử lý kết quả, quyết định SUCCESS/PENDING/ERROR
└────────┬────────┘
         ↓
┌─────────────────┐
│ Update Attempt  │ ← Cập nhật log attempt
└────────┬────────┘
         ↓
┌─────────────────┐
│Update Job Status│ ← Cập nhật trạng thái job (SUCCESS/PENDING với scheduledAt mới/ERROR)
└────────┬────────┘
         ↓
┌─────────────────┐
│   Log Result    │ ← Console log kết quả
└────────┬────────┘
         ↓
      [Done]
```

## Retry Logic

- **Lần 1 thất bại**: Đặt `scheduledAt = now + 1 phút`, `status = PENDING`
- **Lần 2 thất bại**: Đặt `scheduledAt = now + 5 phút`, `status = PENDING`
- **Lần 3 thất bại**: Đặt `status = ERROR`, không retry nữa

## Ưu điểm so với code worker

### ✅ UI/UX tốt hơn

- Xem executions, logs trực quan
- Retry/re-run thủ công dễ dàng
- Không cần restart process khi sửa logic

### ✅ Tích hợp dễ dàng

- Kết nối database qua UI
- Thêm notification (Slack, Email) chỉ cần kéo thả node
- Monitor qua n8n dashboard

### ✅ Không cần deploy riêng

- Chạy trong n8n, không cần maintain process riêng
- Không lo crash/restart scheduler

## So sánh với code worker

| Tiêu chí    | n8n Workflow                    | Code Worker (`scheduler-worker.ts`) |
| ----------- | ------------------------------- | ----------------------------------- |
| Cài đặt     | Import JSON, config credentials | Chạy `npm run scheduler`            |
| Logs        | UI executions, có thể filter    | Console log, cần tail process       |
| Sửa logic   | Sửa trong UI, không cần deploy  | Sửa code, restart process           |
| Retry       | Tự động trong workflow          | Tự động trong code                  |
| Monitoring  | n8n dashboard                   | Cần setup riêng (PM2, logs)         |
| Performance | Tốt cho vài nghìn jobs/giờ      | Tốt hơn cho hàng chục nghìn jobs    |
| Control     | Ít kiểm soát code               | Full control                        |

## Test workflow

### 1. Tạo job test

```powershell
$scheduledTime = (Get-Date).AddMinutes(2).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
$body = @{
    content_text = "Test scheduler workflow - $(Get-Date)"
    hashtags = @("#test", "#scheduler")
    media = @()
    platforms = @("facebook")
    scheduled_at = $scheduledTime
    timezone = "Asia/Ho_Chi_Minh"
    userId = "demo-user"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/schedule" -Method POST -ContentType "application/json" -Body $body
```

### 2. Xem job trong n8n

- Vào n8n → Executions
- Sau 2 phút, bạn sẽ thấy execution mới
- Click vào để xem chi tiết từng bước

### 3. Kiểm tra database

```sql
-- Xem job
SELECT id, status, "attemptCount", "scheduledAt", "lastAttemptAt"
FROM "ScheduledPost"
ORDER BY "createdAt" DESC
LIMIT 5;

-- Xem attempts
SELECT * FROM "ScheduledPostAttempt"
ORDER BY "startedAt" DESC
LIMIT 10;
```

## Troubleshooting

### Workflow không chạy

1. **Kiểm tra workflow đã active chưa**

   - Vào n8n UI → Workflows → Xem trạng thái

2. **Kiểm tra credentials**

   - Vào Credentials → Test connection

3. **Xem executions có lỗi không**
   - Vào Executions → Filter "Error"

### Job không được publish

1. **Kiểm tra endpoint `/api/posts`**

   - Đảm bảo server Next.js đang chạy
   - Test trực tiếp: `curl http://localhost:3000/api/posts`

2. **Kiểm tra Internal API Key**

   - Đảm bảo header `X-Internal-API-Key` khớp với `.env`

3. **Xem logs trong execution**
   - Click vào execution → Xem output từng node

### Performance kém

1. **Giảm số job xử lý mỗi lần**

   - Sửa `LIMIT 20` → `LIMIT 10` trong node "Fetch Due Jobs"

2. **Tăng timeout**
   - Trong node "Publish Post" → Options → Timeout

## Migration từ code worker

### Bước 1: Tắt code worker

```powershell
# Dừng process scheduler-worker.ts
# Ctrl+C trong terminal đang chạy
```

### Bước 2: Import và active workflow n8n

```bash
# Import như hướng dẫn phần "Cài đặt"
```

### Bước 3: Theo dõi 1 giờ đầu

- Xem executions trong n8n
- So sánh với logs cũ
- Đảm bảo không có job bị miss

### Bước 4: Xóa code worker (optional)

```bash
# Backup trước
git commit -am "Backup scheduler-worker before migration"

# Xóa script
rm scripts/scheduler-worker.ts

# Xóa script trong package.json
# "scheduler": "tsx scripts/scheduler-worker.ts"
```

## Kết luận

Workflow n8n này cung cấp:

- ✅ Quản lý scheduler qua UI
- ✅ Logs và monitoring trực quan
- ✅ Retry tự động với backoff
- ✅ Không cần maintain process riêng

**Khuyến nghị**: Dùng n8n cho môi trường vừa và nhỏ (< 5,000 jobs/giờ). Nếu cần scale lớn hơn, quay lại code worker + BullMQ/Redis.

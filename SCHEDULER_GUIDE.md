# Hướng dẫn Test Chức năng Lên lịch (Scheduler)

## Vấn đề đã phát hiện

**Scheduler worker KHÔNG tự động chạy!** Đây là lý do tại sao bài viết đã lên lịch không được đăng.

## Giải pháp

### 1. Khởi động Scheduler Worker

Scheduler worker cần chạy song song với Next.js dev server:

```powershell
# Terminal 1: Next.js dev server
npm run dev

# Terminal 2: Scheduler worker (MỚI - cần thiết!)
npm run scheduler
```

### 2. Kiểm tra Scheduler đang chạy

```powershell
Get-Process | Where-Object {
    $cmdLine = (Get-WmiObject Win32_Process -Filter "ProcessId=$($_.Id)" -ErrorAction SilentlyContinue).CommandLine
    $cmdLine -like "*scheduler-worker*"
}
```

## Cách test

### Phương pháp 1: Test qua UI (Khuyến nghị)

1. **Mở Content Creation** → http://localhost:3000/content-creation
2. **Tạo nội dung AI** hoặc nhập nội dung thủ công
3. **Click "Chọn lịch đăng"**
4. **Chọn thời gian** 2-3 phút sau (để có thời gian quan sát)
5. **Lưu lịch**
6. **Mở tab Schedule** → http://localhost:3000/content-creation (tab "Lịch đăng bài")
7. **Quan sát**:
   - Ban đầu: `status = PENDING`
   - Sau khi đến giờ (trong vòng 1 phút): `status = PROCESSING` → `SUCCESS` hoặc `ERROR`

### Phương pháp 2: Test nhanh với API

```powershell
# Tạo bài test đăng 2 phút sau
$scheduledTime = (Get-Date).AddMinutes(2).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
$body = @{
    content_text = "Test tự động - $(Get-Date)"
    hashtags = @("#test", "#scheduler")
    media = @()
    platforms = @("facebook")
    scheduled_at = $scheduledTime
    timezone = "Asia/Ho_Chi_Minh"
    userId = "demo-user"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/schedule" -Method POST -ContentType "application/json" -Body $body
```

### Phương pháp 3: Test ngay lập tức

Nếu bạn muốn test mà không chờ, dùng endpoint `run-now`:

```powershell
# Lấy ID của job đã tạo
$jobs = Invoke-RestMethod -Uri "http://localhost:3000/api/schedule?status=PENDING" -Method GET
$jobId = $jobs.jobs[0].id

# Chạy ngay
Invoke-RestMethod -Uri "http://localhost:3000/api/schedule/$jobId/run-now" -Method POST
```

## Giám sát

### 1. Xem logs của Scheduler Worker

```powershell
# Trong terminal đang chạy scheduler, bạn sẽ thấy:
# [scheduler] starting cron worker
# [scheduler] Processing job: <id>
# [scheduler] Success/Error messages
```

### 2. Kiểm tra trạng thái qua API

```powershell
# Pending jobs
Invoke-RestMethod -Uri "http://localhost:3000/api/schedule?status=PENDING"

# Successful jobs
Invoke-RestMethod -Uri "http://localhost:3000/api/schedule?status=SUCCESS"

# Failed jobs
Invoke-RestMethod -Uri "http://localhost:3000/api/schedule?status=ERROR"
```

### 3. Xem chi tiết một job

```powershell
$jobs = Invoke-RestMethod -Uri "http://localhost:3000/api/schedule?status=SUCCESS"
$jobs.jobs[0] | ConvertTo-Json -Depth 3
```

## Luồng hoạt động

```
1. User tạo lịch → POST /api/schedule
   ↓
2. Lưu vào DB với status = PENDING
   ↓
3. Scheduler worker (cron mỗi phút) kiểm tra jobs có scheduledAt <= now
   ↓
4. Lock job → status = PROCESSING
   ↓
5. Gọi n8n webhook (POST /api/posts)
   ↓
6. Cập nhật status:
   - SUCCESS nếu đăng thành công
   - PENDING với scheduledAt mới nếu retry (max 3 lần)
   - ERROR nếu hết retry
```

## Retry Logic

- **Lần 1 thất bại**: Retry sau 1 phút
- **Lần 2 thất bại**: Retry sau 5 phút
- **Lần 3 thất bại**: Đánh dấu ERROR (không retry nữa)

## Troubleshooting

### Scheduler không chạy

```powershell
# Kiểm tra process
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Select-Object Id, ProcessName, StartTime

# Restart scheduler
# Ctrl+C trong terminal scheduler, rồi chạy lại
npm run scheduler
```

### Bài viết không đăng dù status = SUCCESS

- Kiểm tra n8n webhook có hoạt động không
- Xem logs của n8n workflow
- Kiểm tra `externalResults` field trong DB

### Database connection error

```powershell
# Kiểm tra PostgreSQL đang chạy
Get-Service -Name postgresql*

# Test connection
npm run db:studio
```

## Best Practices

1. **Luôn chạy scheduler worker** khi dev hoặc production
2. **Set up PM2** hoặc systemd để scheduler tự động restart nếu crash
3. **Monitor logs** định kỳ để phát hiện lỗi sớm
4. **Test với 2-3 phút delay** trước để quan sát flow
5. **Dùng timezone đúng** (Asia/Ho_Chi_Minh cho VN)

## Production Setup

```bash
# Install PM2
npm install -g pm2

# Start Next.js
pm2 start npm --name "nextjs" -- start

# Start Scheduler
pm2 start npm --name "scheduler" -- run scheduler

# Save config
pm2 save

# Auto-start on boot
pm2 startup
```

## Kết luận

✅ **Scheduler đã được khởi động thành công**
✅ Worker sẽ chạy mỗi phút để kiểm tra jobs
✅ Sẵn sàng test!

**Lưu ý quan trọng**: Scheduler worker PHẢI luôn chạy để lên lịch hoạt động. Không chạy = không có bài tự động đăng!

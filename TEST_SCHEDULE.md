# HƯỚNG DẪN TEST CHỨC NĂNG LÊN LỊCH

## Bước 1: Khởi động các service cần thiết

### Terminal 1 - Next.js App
```powershell
pnpm dev
# Hoặc nếu đã build:
# pnpm start
```

### Terminal 2 - Scheduler Worker
```powershell
pnpm run scheduler
```

**Kết quả mong đợi:**
```
[scheduler] starting cron worker
```

Scheduler sẽ chạy mỗi phút để kiểm tra jobs đến hạn.

---

## Bước 2: Đăng nhập vào ứng dụng

1. Mở trình duyệt: `http://localhost:3000`
2. Đăng nhập với tài khoản của bạn
3. Vào trang **Content Creation**

---

## Bước 3: Test UI - Tạo lịch đăng bài

### Cách 1: Qua giao diện web

1. Tại trang Content Creation:
   - Tạo nội dung mới (hoặc dùng nội dung có sẵn)
   - Click nút **"Chọn lịch đăng"**
   
2. Trong modal popup:
   - Chọn ngày: Ngày mai
   - Chọn giờ: 09:00 (hoặc giờ bất kỳ)
   - Click **"Lên lịch"**

3. Kiểm tra tab **"Lịch đăng bài"**:
   - Xem danh sách các bài đã lên lịch
   - Thống kê: "X bài trong tuần", "Y bài hôm nay"

---

## Bước 4: Test API - Tạo lịch qua PowerShell

Chạy script test tự động:

```powershell
.\test-schedule-feature.ps1
```

Script sẽ:
- ✓ Kiểm tra Next.js app đang chạy
- ✓ Kiểm tra scheduler worker đang chạy
- ✓ Tạo 1 scheduled post (lên lịch 2 phút sau)
- ✓ Liệt kê danh sách jobs PENDING
- ✓ (Optional) Chạy job ngay lập tức

---

## Bước 5: Theo dõi logs

### Xem scheduler logs (real-time)
```powershell
Get-Content logs\scheduler-out.log -Wait -Tail 20
```

**Kết quả khi scheduler chạy job:**
```
[scheduler] starting cron worker
[scheduler] Processing job: <job-id>
[scheduler] Job <job-id> succeeded
```

### Xem app logs
```powershell
Get-Content logs\app-out.log -Wait -Tail 20
```

---

## Bước 6: Kiểm tra database

```powershell
pnpm prisma studio
```

Mở trình duyệt: `http://localhost:5555`

**Kiểm tra các table:**

1. **ScheduledPost**:
   - Xem các job đã tạo
   - Trạng thái: PENDING, PROCESSING, SUCCESS, ERROR
   - Thời gian: scheduledAt, createdAt, updatedAt

2. **ScheduledPostAttempt**:
   - Log của từng lần thử
   - attemptNo, success, errorMessage
   - startedAt, finishedAt

---

## Test Cases

### ✅ Test Case 1: Lên lịch thành công
1. Tạo scheduled post lên lịch 2 phút sau
2. Đợi 2-3 phút
3. Kiểm tra status đã chuyển SUCCESS
4. Kiểm tra bài đăng trên platform (nếu có account thật)

### ✅ Test Case 2: Run-now
1. Tạo scheduled post lên lịch ngày mai
2. Gọi API: `POST /api/schedule/{id}/run-now`
3. Scheduler sẽ chạy job trong 1 phút tới

### ✅ Test Case 3: Cancel job
1. Tạo scheduled post
2. Gọi API: `POST /api/schedule/{id}/cancel`
3. Status chuyển sang CANCELLED
4. Scheduler sẽ bỏ qua job này

### ✅ Test Case 4: Retry khi lỗi
1. Tắt internet/n8n webhook
2. Tạo scheduled post đã tới giờ
3. Job sẽ fail → retry sau 1 phút, 5 phút, 15 phút
4. Sau 3 lần → status ERROR

---

## API Endpoints

### Tạo scheduled post
```http
POST http://localhost:3000/api/schedule
Content-Type: application/json

{
  "content_text": "Test post",
  "hashtags": ["#test"],
  "media": [],
  "platforms": ["facebook"],
  "scheduled_at": "2025-12-20T09:00:00Z",
  "timezone": "Asia/Ho_Chi_Minh"
}
```

### Liệt kê jobs
```http
GET http://localhost:3000/api/schedule?status=PENDING
GET http://localhost:3000/api/schedule?status=SUCCESS
GET http://localhost:3000/api/schedule?from=2025-12-19&to=2025-12-31
```

### Chạy ngay
```http
POST http://localhost:3000/api/schedule/{job-id}/run-now
```

### Hủy job
```http
POST http://localhost:3000/api/schedule/{job-id}/cancel
```

---

## Troubleshooting

### Lỗi: "Unauthorized. Please login first."
→ Bạn chưa đăng nhập. Login qua UI trước hoặc dùng session cookie.

### Scheduler không chạy jobs
1. Kiểm tra scheduler worker có chạy không:
   ```powershell
   tasklist | findstr node
   ```
2. Xem logs:
   ```powershell
   Get-Content logs\scheduler-error.log -Tail 50
   ```
3. Kiểm tra database connection (DATABASE_URL trong .env)

### Job bị stuck ở PROCESSING
→ Worker bị crash giữa chừng. Tự động retry sau 1 phút hoặc restart worker.

### Job failed với ERROR
→ Xem `ScheduledPostAttempt.errorMessage` để biết nguyên nhân:
- "HTTP 401": Chưa có social account hoặc token hết hạn
- "HTTP 500": Lỗi server/n8n
- "Connection refused": n8n không chạy

---

## Production Deployment (PM2)

Khi deploy production, dùng PM2 để quản lý cả 2 services:

```powershell
# Build app
pnpm build

# Start với PM2
pm2 start ecosystem.config.js

# Xem logs
pm2 logs

# Xem status
pm2 status

# Restart
pm2 restart all

# Stop
pm2 stop all
```

Cấu hình trong `ecosystem.config.js`:
- `ai-marketing-app`: Next.js server (2 instances, cluster mode)
- `ai-marketing-scheduler`: Scheduler worker (1 instance)

---

## Checklist

- [ ] Next.js app chạy
- [ ] Scheduler worker chạy
- [ ] Database kết nối được
- [ ] Có tài khoản đăng nhập
- [ ] Có social account provisioned (nếu test đăng thật)
- [ ] Test tạo scheduled post qua UI
- [ ] Test tạo scheduled post qua API
- [ ] Xem logs scheduler
- [ ] Kiểm tra database
- [ ] Test run-now
- [ ] Test cancel
- [ ] Test retry khi lỗi

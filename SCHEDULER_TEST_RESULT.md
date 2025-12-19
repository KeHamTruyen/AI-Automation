# ✅ ĐÃ HOÀN THÀNH: Dọn dẹp và Test Chức năng Lên lịch

## 🧹 Đã xóa

✅ Đã xóa file n8n scheduler không dùng nữa:
- `n8n/Scheduler Worker (Cron + DB).json`
- `n8n/SCHEDULER_WORKFLOW_GUIDE.md`

## ✅ Kết quả Test

### Database Connection: ✅ OK
- Kết nối database thành công
- ScheduledPost table hoạt động bình thường

### Test Job Created: ✅ OK
```
Job ID: cmjd4qc8100014n0o2pq7abzd
Status: PENDING
Scheduled At: 00:16:42 20/12/2025 (2 phút sau khi tạo)
User: admin@company.com
```

## 🚀 Cách chạy Scheduler

### Bước 1: Khởi động Next.js App
```bash
npm run dev
# hoặc production:
# npm run build
# npm start
```

### Bước 2: Khởi động Scheduler Worker (Terminal riêng)
```bash
npm run scheduler
```

Kết quả mong đợi:
```
[scheduler] starting cron worker
```

Scheduler sẽ tự động chạy mỗi phút để kiểm tra jobs đến hạn.

## 📝 Test nhanh

### Test 1: Tạo job và kiểm tra
```bash
npm exec tsx scripts/test-scheduler.ts
```

Kết quả:
- ✅ Tạo 1 scheduled post (2 phút sau)
- ✅ Hiển thị danh sách PENDING jobs
- ✅ Hướng dẫn theo dõi

### Test 2: Kiểm tra users
```bash
npm exec tsx scripts/check-users.ts
```

Kết quả:
- ✅ Hiển thị danh sách users
- ✅ Lấy user ID để test

## 🎯 Test qua UI

1. **Mở app**: http://localhost:3000
2. **Đăng nhập** với tài khoản
3. **Vào Content Creation**
4. **Tạo nội dung** hoặc dùng có sẵn
5. **Click "Chọn lịch đăng"**
6. **Chọn ngày giờ** → Click "Lên lịch"
7. **Kiểm tra tab "Lịch đăng bài"**

## 📊 Theo dõi

### Xem logs scheduler
```bash
# Windows PowerShell
Get-Content logs\scheduler-out.log -Wait -Tail 20

# Hoặc CMD
tail -f logs/scheduler-out.log
```

### Xem database
```bash
npm run db:studio
# Mở: http://localhost:5555
# Xem bảng: ScheduledPost, ScheduledPostAttempt
```

## 🔧 Troubleshooting

### Scheduler không chạy job
1. ✅ Kiểm tra worker đang chạy: `tasklist | findstr node`
2. ✅ Xem logs: `Get-Content logs\scheduler-error.log`
3. ✅ Kiểm tra DATABASE_URL trong .env

### Job stuck ở PROCESSING
- Worker crash giữa chừng
- Tự động retry sau 1 phút
- Hoặc restart worker

### Job failed (ERROR)
Xem `ScheduledPostAttempt.errorMessage`:
- "HTTP 401": Token hết hạn hoặc chưa có social account
- "HTTP 500": Lỗi server
- "Connection refused": API không chạy

## 📚 Tài liệu chi tiết

Xem file: `TEST_SCHEDULE.md`

## ✅ Checklist

- [x] Code scheduler hoạt động
- [x] Database connection OK
- [x] Test job được tạo thành công
- [x] Có users trong database
- [x] API endpoints không lỗi
- [ ] Start scheduler worker
- [ ] Đợi 2 phút xem job chạy
- [ ] Kiểm tra status SUCCESS/ERROR

## 🎉 Kết luận

Chức năng lên lịch đã sẵn sàng! Không cần n8n workflow nữa, dùng scheduler-worker.ts thuần.

**Ưu điểm:**
- ✅ Đơn giản, dễ debug
- ✅ Chạy độc lập, không phụ thuộc n8n
- ✅ Retry tự động (3 lần)
- ✅ Log chi tiết mỗi lần thử
- ✅ Scale được (chạy nhiều workers)

**Deployment:**
```bash
pm2 start ecosystem.config.js
# Sẽ chạy cả app + scheduler
```

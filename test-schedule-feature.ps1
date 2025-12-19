# Test Script for Scheduling Feature
# Kiểm tra chức năng lên lịch đăng bài

Write-Host "=== TEST CHỨC NĂNG LÊN LỊCH ===" -ForegroundColor Cyan
Write-Host ""

# 1. Kiểm tra Next.js app đang chạy
Write-Host "1. Kiểm tra Next.js app..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5 -UseBasicParsing
    Write-Host "   ✓ Next.js app đang chạy" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Next.js app KHÔNG chạy!" -ForegroundColor Red
    Write-Host "   → Chạy: pnpm dev hoặc pnpm start" -ForegroundColor Yellow
    exit 1
}

# 2. Kiểm tra scheduler worker có đang chạy không
Write-Host ""
Write-Host "2. Kiểm tra scheduler worker..." -ForegroundColor Yellow
$schedulerProcess = Get-Process | Where-Object {
    $cmdLine = (Get-CimInstance Win32_Process -Filter "ProcessId = $($_.Id)").CommandLine
    $cmdLine -like "*scheduler-worker*"
}

if ($schedulerProcess) {
    Write-Host "   ✓ Scheduler worker đang chạy (PID: $($schedulerProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "   ⚠ Scheduler worker KHÔNG chạy" -ForegroundColor Yellow
    Write-Host "   → Chạy: pnpm run scheduler (trong terminal riêng)" -ForegroundColor Yellow
    Write-Host "   → Hoặc: pm2 start ecosystem.config.js" -ForegroundColor Yellow
}

# 3. Test tạo scheduled post
Write-Host ""
Write-Host "3. Test tạo scheduled post..." -ForegroundColor Yellow

# Tạo thời gian 2 phút sau
$scheduledTime = (Get-Date).AddMinutes(2).ToString("yyyy-MM-ddTHH:mm:ss")

$body = @{
    content_text = "TEST SCHEDULED POST - $(Get-Date -Format 'HH:mm:ss')"
    hashtags = @("#test", "#automation")
    media = @()
    platforms = @("facebook")
    scheduled_at = $scheduledTime
    timezone = "Asia/Ho_Chi_Minh"
} | ConvertTo-Json

Write-Host "   → Lên lịch đăng lúc: $scheduledTime" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/schedule" `
                                  -Method POST `
                                  -ContentType "application/json" `
                                  -Body $body `
                                  -SessionVariable session

    if ($response.success) {
        Write-Host "   ✓ Tạo scheduled post thành công!" -ForegroundColor Green
        Write-Host "   → Job ID: $($response.job.id)" -ForegroundColor Cyan
        Write-Host "   → Status: $($response.job.status)" -ForegroundColor Cyan
        Write-Host "   → Scheduled At: $($response.job.scheduledAt)" -ForegroundColor Cyan
        
        $jobId = $response.job.id
    } else {
        Write-Host "   ✗ Tạo thất bại: $($response.error)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ✗ Lỗi: $_" -ForegroundColor Red
    Write-Host "   → Bạn đã đăng nhập chưa? Hãy login trước khi test" -ForegroundColor Yellow
    exit 1
}

# 4. Kiểm tra danh sách scheduled posts
Write-Host ""
Write-Host "4. Kiểm tra danh sách scheduled posts..." -ForegroundColor Yellow

try {
    $listResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/schedule?status=PENDING" `
                                       -Method GET `
                                       -WebSession $session

    if ($listResponse.success) {
        $count = $listResponse.jobs.Count
        Write-Host "   ✓ Có $count job PENDING" -ForegroundColor Green
        
        if ($count -gt 0) {
            Write-Host ""
            Write-Host "   Danh sách jobs:" -ForegroundColor Cyan
            foreach ($job in $listResponse.jobs | Select-Object -First 5) {
                Write-Host "   - ID: $($job.id)" -ForegroundColor White
                Write-Host "     Content: $($job.contentText.Substring(0, [Math]::Min(50, $job.contentText.Length)))..." -ForegroundColor Gray
                Write-Host "     Scheduled: $($job.scheduledAt)" -ForegroundColor Gray
                Write-Host "     Status: $($job.status)" -ForegroundColor Gray
                Write-Host ""
            }
        }
    }
} catch {
    Write-Host "   ✗ Lỗi khi lấy danh sách: $_" -ForegroundColor Red
}

# 5. Test run-now (optional)
Write-Host ""
Write-Host "5. Test chạy ngay (run-now)..." -ForegroundColor Yellow
$runNow = Read-Host "Bạn có muốn chạy job ngay không? (y/n)"

if ($runNow -eq "y") {
    try {
        $runResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/schedule/$jobId/run-now" `
                                          -Method POST `
                                          -WebSession $session

        if ($runResponse.success) {
            Write-Host "   ✓ Job được đặt chạy ngay!" -ForegroundColor Green
            Write-Host "   → Scheduler sẽ pick up job trong 1 phút tới" -ForegroundColor Cyan
        } else {
            Write-Host "   ✗ Lỗi: $($runResponse.error)" -ForegroundColor Red
        }
    } catch {
        Write-Host "   ✗ Lỗi: $_" -ForegroundColor Red
    }
}

# 6. Hướng dẫn tiếp theo
Write-Host ""
Write-Host "=== HƯỚNG DẪN TIẾP THEO ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ Theo dõi scheduler logs:" -ForegroundColor Yellow
Write-Host "  → tail -f logs/scheduler-out.log" -ForegroundColor White
Write-Host "  → Get-Content logs\scheduler-out.log -Wait -Tail 20" -ForegroundColor White
Write-Host ""
Write-Host "✓ Kiểm tra job status:" -ForegroundColor Yellow
Write-Host "  → GET http://localhost:3000/api/schedule?status=SUCCESS" -ForegroundColor White
Write-Host "  → GET http://localhost:3000/api/schedule?status=ERROR" -ForegroundColor White
Write-Host ""
Write-Host "✓ Hủy job:" -ForegroundColor Yellow
Write-Host "  → POST http://localhost:3000/api/schedule/$jobId/cancel" -ForegroundColor White
Write-Host ""
Write-Host "✓ Xem database:" -ForegroundColor Yellow
Write-Host "  → pnpm prisma studio" -ForegroundColor White
Write-Host "  → Table: ScheduledPost, ScheduledPostAttempt" -ForegroundColor White
Write-Host ""

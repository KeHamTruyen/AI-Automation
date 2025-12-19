# Test API Schedule trực tiếp

Write-Host "=== TEST API /api/schedule ===" -ForegroundColor Cyan
Write-Host ""

# Lấy cookie từ browser (cần login trước)
Write-Host "⚠ LƯU Ý: Bạn cần đăng nhập vào http://localhost:3000 trước!" -ForegroundColor Yellow
Write-Host "Sau khi login, mở Browser DevTools → Application → Cookies → Copy 'auth-token'" -ForegroundColor Yellow
Write-Host ""

$authToken = Read-Host "Nhập auth-token cookie (hoặc Enter để bỏ qua)"

if ($authToken) {
    Write-Host ""
    Write-Host "1. Test GET /api/schedule (lấy danh sách)..." -ForegroundColor Yellow
    
    try {
        $headers = @{
            "Cookie" = "auth-token=$authToken"
        }
        
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/schedule?status=PENDING" `
                                       -Method GET `
                                       -Headers $headers
        
        if ($response.success) {
            Write-Host "   ✓ API hoạt động!" -ForegroundColor Green
            Write-Host "   → Tìm thấy $($response.jobs.Count) jobs PENDING" -ForegroundColor Cyan
            
            if ($response.jobs.Count -gt 0) {
                Write-Host ""
                Write-Host "   Danh sách jobs:" -ForegroundColor Cyan
                foreach ($job in $response.jobs | Select-Object -First 3) {
                    Write-Host "   - ID: $($job.id)" -ForegroundColor White
                    Write-Host "     Content: $($job.contentText.Substring(0, [Math]::Min(40, $job.contentText.Length)))..." -ForegroundColor Gray
                    Write-Host "     Scheduled: $($job.scheduledAt)" -ForegroundColor Gray
                    Write-Host "     Status: $($job.status)" -ForegroundColor Gray
                    Write-Host ""
                }
            } else {
                Write-Host ""
                Write-Host "   ⚠ Không có job nào!" -ForegroundColor Yellow
                Write-Host "   → Tạo job mới: npm exec tsx scripts/test-scheduler.ts" -ForegroundColor Cyan
            }
        } else {
            Write-Host "   ✗ API lỗi: $($response.error)" -ForegroundColor Red
        }
    } catch {
        Write-Host "   ✗ Lỗi: $_" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "2. Test GET /api/schedule (all statuses)..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/schedule" `
                                       -Method GET `
                                       -Headers $headers
        
        if ($response.success) {
            Write-Host "   ✓ Tổng cộng: $($response.jobs.Count) jobs" -ForegroundColor Green
            
            # Group by status
            $byStatus = $response.jobs | Group-Object -Property status
            foreach ($group in $byStatus) {
                Write-Host "   - $($group.Name): $($group.Count) jobs" -ForegroundColor Cyan
            }
        }
    } catch {
        Write-Host "   ✗ Lỗi: $_" -ForegroundColor Red
    }
    
} else {
    Write-Host "Bỏ qua test với auth token." -ForegroundColor Gray
    Write-Host ""
    Write-Host "Để test đầy đủ:" -ForegroundColor Yellow
    Write-Host "1. Mở http://localhost:3000" -ForegroundColor White
    Write-Host "2. Đăng nhập" -ForegroundColor White
    Write-Host "3. F12 → Application → Cookies → Copy 'auth-token'" -ForegroundColor White
    Write-Host "4. Chạy lại script này và paste token" -ForegroundColor White
}

Write-Host ""
Write-Host "=== KIỂM TRA DATABASE ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Chạy Prisma Studio để xem trực tiếp:" -ForegroundColor Yellow
Write-Host "  npm run db:studio" -ForegroundColor White
Write-Host ""
Write-Host "Hoặc query SQL trực tiếp:" -ForegroundColor Yellow
Write-Host '  SELECT * FROM "ScheduledPost" ORDER BY "createdAt" DESC LIMIT 5;' -ForegroundColor White
Write-Host ""

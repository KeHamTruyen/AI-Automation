# Test scheduler functionality
Write-Host "=== Testing Scheduler Functionality ===" -ForegroundColor Cyan

# 1. Create a test scheduled post (2 minutes from now)
$scheduledTime = (Get-Date).AddMinutes(2).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
Write-Host "`n1. Creating test scheduled post for: $scheduledTime" -ForegroundColor Yellow

$body = @{
    content_text = "Test scheduled post - Auto-generated at $(Get-Date)"
    hashtags = @("#test", "#scheduler")
    media = @()
    platforms = @("facebook")
    scheduled_at = $scheduledTime
    timezone = "Asia/Ho_Chi_Minh"
    userId = "demo-user"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/schedule" -Method POST -ContentType "application/json" -Body $body
    Write-Host "✓ Created scheduled post:" -ForegroundColor Green
    Write-Host "  ID: $($response.job.id)"
    Write-Host "  Status: $($response.job.status)"
    Write-Host "  Scheduled: $($response.job.scheduledAt)"
    $jobId = $response.job.id
} catch {
    Write-Host "✗ Failed to create scheduled post: $_" -ForegroundColor Red
    exit 1
}

# 2. Verify the post is in the database
Write-Host "`n2. Fetching scheduled posts from API..." -ForegroundColor Yellow
try {
    $jobs = Invoke-RestMethod -Uri "http://localhost:3000/api/schedule?status=PENDING&userId=demo-user" -Method GET
    Write-Host "✓ Found $($jobs.jobs.Count) pending jobs" -ForegroundColor Green
    $jobs.jobs | ForEach-Object {
        Write-Host "  - $($_.id): $($_.contentText.Substring(0, [Math]::Min(50, $_.contentText.Length)))... [Status: $($_.status)]"
    }
} catch {
    Write-Host "✗ Failed to fetch jobs: $_" -ForegroundColor Red
}

# 3. Check if scheduler worker is running
Write-Host "`n3. Checking if scheduler worker is running..." -ForegroundColor Yellow
$schedulerProcess = Get-Process | Where-Object {
    $cmdLine = (Get-WmiObject Win32_Process -Filter "ProcessId=$($_.Id)" -ErrorAction SilentlyContinue).CommandLine
    $cmdLine -like "*scheduler-worker*"
}

if ($schedulerProcess) {
    Write-Host "✓ Scheduler worker is running (PID: $($schedulerProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "✗ Scheduler worker is NOT running!" -ForegroundColor Red
    Write-Host "  Start it with: npm run scheduler" -ForegroundColor Yellow
}

# 4. Instructions
Write-Host "`n=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Make sure scheduler worker is running: npm run scheduler"
Write-Host "2. Wait 2 minutes and check if post is published"
Write-Host "3. Monitor worker logs for execution"
Write-Host "4. Check post status: GET http://localhost:3000/api/schedule?status=SUCCESS"
Write-Host "`nTo test immediately, call: POST http://localhost:3000/api/schedule/$jobId/run-now"

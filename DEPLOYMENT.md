# 🚀 Production Deployment Guide

## Lỗi: "Failed to find Server Action"

Lỗi này xảy ra khi:
- Next.js cache cũ không đồng bộ với code mới
- PM2 restart mà chưa rebuild
- Build artifacts bị corrupt

## ✅ Cách fix (Trên server production):

### 1. **Chạy script deploy tự động:**

```bash
# Trên server Linux
chmod +x deploy.sh
./deploy.sh
```

### 2. **Hoặc chạy từng bước thủ công:**

```bash
# Bước 1: Pull code mới
git pull origin main

# Bước 2: Install dependencies
pnpm install --frozen-lockfile

# Bước 3: Generate Prisma Client
pnpm db:generate

# Bước 4: Run migrations
npx prisma migrate deploy

# Bước 5: XÓA CACHE HOÀN TOÀN (quan trọng!)
rm -rf .next
rm -rf node_modules/.cache

# Bước 6: Build production
NODE_ENV=production pnpm build

# Bước 7: Restart PM2
pm2 restart ecosystem.config.js --update-env
pm2 save

# Bước 8: Kiểm tra logs
pm2 logs nextjs-app --lines 50
```

## 🔍 Kiểm tra sau khi deploy:

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs nextjs-app --lines 100

# Monitor real-time
pm2 monit

# Check if app is responding
curl http://localhost:3000
```

## ⚠️ Lưu ý quan trọng:

### 1. **LUÔN build trước khi restart:**
```bash
# ❌ SAI - Restart mà không build
pm2 restart nextjs-app

# ✅ ĐÚNG - Build rồi mới restart
pnpm build && pm2 restart nextjs-app
```

### 2. **Clear cache nếu gặp lỗi lạ:**
```bash
rm -rf .next node_modules/.cache
pnpm build
```

### 3. **Environment variables:**
Đảm bảo file `.env` trên server có đầy đủ:
```bash
# Check .env exists
ls -la .env

# Verify important vars
grep JWT_SECRET .env
grep DATABASE_URL .env
```

## 🐛 Troubleshooting:

### Lỗi "Cannot read properties of undefined"
```bash
# Clear everything and rebuild
pm2 stop all
rm -rf .next node_modules/.cache
pnpm install
pnpm build
pm2 restart all
```

### Lỗi "Port already in use"
```bash
# Check what's using port 3000
lsof -i :3000

# Kill the process
pm2 delete nextjs-app
pm2 start ecosystem.config.js
```

### Memory issues
```bash
# Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm build
```

## 📋 Deployment Checklist:

- [ ] Code đã được commit và push lên git
- [ ] Database migrations đã chạy thành công
- [ ] File .env có đầy đủ credentials
- [ ] Xóa .next cache trước khi build
- [ ] Build thành công (no errors)
- [ ] PM2 restart với --update-env
- [ ] Kiểm tra logs không có errors
- [ ] Test app qua curl/browser

## 🚦 Quick Commands:

```bash
# Fast redeploy
rm -rf .next && pnpm build && pm2 restart nextjs-app

# View errors only
pm2 logs nextjs-app --err

# Restart all services
pm2 restart all

# Stop everything (emergency)
pm2 stop all
```

## 📊 Monitoring:

```bash
# Real-time monitoring
pm2 monit

# CPU/Memory usage
pm2 status

# Application metrics
pm2 describe nextjs-app
```

# 🔒 HTTPS Setup với Certbot - Hướng dẫn đầy đủ

## 📋 Yêu cầu:
- Ubuntu/Debian server
- Domain đã trỏ về server (mkt.gcalls.co)
- Port 80 và 443 mở
- Nginx hoặc Apache

---

## ✅ Bước 1: Cài đặt Certbot

### Với Nginx:
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

### Với Apache:
```bash
sudo apt update
sudo apt install certbot python3-certbot-apache -y
```

---

## ✅ Bước 2: Setup Nginx (khuyến nghị)

### Tạo config Nginx:
```bash
sudo nano /etc/nginx/sites-available/mkt.gcalls.co
```

**Nội dung:**
```nginx
server {
    listen 80;
    server_name mkt.gcalls.co;

    # Certbot validation
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Redirect to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name mkt.gcalls.co;

    # SSL certificates (Certbot sẽ tự động thêm)
    # ssl_certificate /etc/letsencrypt/live/mkt.gcalls.co/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/mkt.gcalls.co/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=3600, immutable";
    }
}
```

### Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/mkt.gcalls.co /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## ✅ Bước 3: Get SSL Certificate

```bash
sudo certbot --nginx -d mkt.gcalls.co
```

**Làm theo hướng dẫn:**
1. Nhập email
2. Đồng ý Terms of Service
3. Chọn: Redirect HTTP to HTTPS (option 2)

---

## ✅ Bước 4: Deploy code mới

**Code đã được chuẩn bị sẵn!** Chỉ cần:

```bash
cd ~/AI-Automation

# Commit code với secure cookie
git add .
git commit -m "Enable secure cookies for HTTPS"
git push

# Pull trên server
git pull

# Rebuild
rm -rf .next
pnpm build

# Restart
pm2 restart nextjs-app
```

---

## ✅ Bước 5: Kiểm tra

### Test HTTPS:
```bash
# Check certificate
curl -I https://mkt.gcalls.co

# Should show:
# HTTP/2 200
# strict-transport-security: max-age=31536000
```

### Test cookies:
1. Login tại https://mkt.gcalls.co/login
2. F12 → Application → Cookies
3. Kiểm tra cookie `auth-token`:
   - ✅ HttpOnly: true
   - ✅ Secure: true
   - ✅ SameSite: Lax

---

## 🔄 Auto-renewal

Certbot tự động setup cron job. Kiểm tra:

```bash
# Test renewal
sudo certbot renew --dry-run

# Check timer
sudo systemctl status certbot.timer
```

---

## 🔧 Troubleshooting

### Port 80/443 bị chặn:
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

### Certificate không tạo được:
```bash
# Check DNS
dig mkt.gcalls.co

# Check port
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443
```

### Nginx lỗi:
```bash
# Check logs
sudo tail -f /var/log/nginx/error.log

# Test config
sudo nginx -t
```

---

## 📊 Performance optimization

Thêm vào nginx config:

```nginx
# Gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1000;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

# Rate limiting
limit_req_zone $binary_remote_addr zone=login:10m rate=10r/m;
location /api/auth/login {
    limit_req zone=login burst=5;
    proxy_pass http://localhost:3000;
}
```

---

## ✅ Checklist sau khi setup HTTPS:

- [ ] Certificate được cài đặt thành công
- [ ] HTTP redirect sang HTTPS
- [ ] Cookies có Secure flag
- [ ] Security headers được set
- [ ] Auto-renewal hoạt động
- [ ] PM2 restart app thành công
- [ ] Login/logout hoạt động bình thường
- [ ] No mixed content warnings

---

## 🎯 Summary

**Code đã sẵn sàng cho HTTPS!** 

Chỉ cần:
1. Setup Nginx với config trên
2. Chạy Certbot
3. Deploy code mới (git pull + rebuild + restart)
4. Test login

Done! 🚀

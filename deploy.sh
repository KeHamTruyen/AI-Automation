#!/bin/bash

# 🚀 Production Deployment Script
# Fix Next.js cache issues and proper PM2 deployment

set -e  # Exit on error

echo "🔄 Starting deployment..."

# 1. Pull latest code
echo "📥 Pulling latest code from git..."
git pull origin main

# 2. Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# 3. Generate Prisma Client
echo "🗄️  Generating Prisma Client..."
pnpm db:generate

# 4. Run database migrations (production safe)
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# 5. Clear Next.js cache completely
echo "🧹 Clearing Next.js cache..."
rm -rf .next
rm -rf node_modules/.cache

# 6. Build Next.js for production
echo "🏗️  Building Next.js app..."
NODE_ENV=production pnpm build

# 7. Restart PM2 apps
echo "♻️  Restarting PM2 apps..."
pm2 restart ecosystem.config.js --update-env

# 8. Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

echo "✅ Deployment completed successfully!"
echo ""
echo "📊 Check status: pm2 status"
echo "📝 View logs: pm2 logs nextjs-app"
echo "🔍 Monitor: pm2 monit"

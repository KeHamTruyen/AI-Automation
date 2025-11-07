# Database Setup Guide

## PostgreSQL Setup

### 1. Cài đặt PostgreSQL

#### Windows:

1. Download PostgreSQL từ: https://www.postgresql.org/download/windows/
2. Cài đặt và nhớ password cho user `postgres`
3. Mở pgAdmin hoặc command line

#### macOS:

\`\`\`bash
brew install postgresql
brew services start postgresql
\`\`\`

#### Ubuntu/Linux:

\`\`\`bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
\`\`\`

### 2. Tạo Database

\`\`\`sql
-- Connect to PostgreSQL as postgres user
CREATE DATABASE ai_marketing_engine;
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ai_marketing_engine TO your_username;
\`\`\`

### 3. Cập nhật .env file

\`\`\`env
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/ai_marketing_engine"
\`\`\`

### 4. Chạy Migration và Seed

\`\`\`bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate

# Seed database with demo data
npm run db:seed
\`\`\`

### 5. Test Database Connection

\`\`\`bash
# Open Prisma Studio to view data
npm run db:studio
\`\`\`

## Alternative: Quick Test with Mock Data

Nếu chưa setup PostgreSQL, bạn vẫn có thể test login với mock data:

- Admin: admin@company.com / admin123
- User: user@company.com / user123

## Commands Summary

\`\`\`bash
# Database commands
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to DB (dev)
npm run db:migrate   # Run migrations (prod)
npm run db:seed      # Seed demo data
npm run db:studio    # Open Prisma Studio

# App commands
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
\`\`\`

## Troubleshooting

### Connection Error

- Check PostgreSQL is running
- Verify credentials in .env
- Check port 5432 is available

### Migration Error

- Ensure database exists
- Check user permissions
- Verify DATABASE_URL format

### Seed Error

- Run `npm run db:generate` first
- Check database connection
- Verify schema is applied

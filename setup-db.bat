@echo off
echo 🚀 AI Marketing Engine Database Setup
echo ====================================
echo.

REM Check if .env exists
if not exist .env (
    echo ❌ .env file not found!
    echo 📋 Copying .env.example to .env...
    copy .env.example .env >nul
    echo ✅ .env file created
)

echo Choose database setup option:
echo 1) Use PostgreSQL (recommended for production)
echo 2) Use Mock Data (no database required)
echo.

set /p choice="Enter your choice (1 or 2): "

if "%choice%"=="1" (
    echo 🐘 Setting up PostgreSQL...
    echo.
    
    REM Get PostgreSQL credentials
    set /p pg_host="PostgreSQL host (default: localhost): "
    if "%pg_host%"=="" set pg_host=localhost
    
    set /p pg_port="PostgreSQL port (default: 5432): "
    if "%pg_port%"=="" set pg_port=5432
    
    set /p pg_user="PostgreSQL username (default: postgres): "
    if "%pg_user%"=="" set pg_user=postgres
    
    set /p pg_password="PostgreSQL password: "
    
    set /p pg_db="Database name (default: ai_marketing_engine): "
    if "%pg_db%"=="" set pg_db=ai_marketing_engine
    
    REM Update DATABASE_URL in .env
    set database_url=postgresql://%pg_user%:%pg_password%@%pg_host%:%pg_port%/%pg_db%
    
    REM Create a temporary file with updated content
    powershell -Command "(Get-Content .env) -replace '^DATABASE_URL=.*', 'DATABASE_URL=\"%database_url%\"' | Set-Content .env"
    
    echo ✅ Database URL updated in .env
    echo.
    echo 🔄 Running database setup...
    
    REM Generate Prisma client
    call npm run db:generate
    
    REM Push schema to database
    call npm run db:push
    
    REM Seed database
    call npm run db:seed
    
    echo ✅ Database setup completed!
    
) else if "%choice%"=="2" (
    echo 📝 Setting up Mock Data mode...
    echo.
    
    REM Disable database by setting empty URL
    powershell -Command "(Get-Content .env) -replace '^DATABASE_URL=.*', 'DATABASE_URL=\"\"' | Set-Content .env"
    
    echo ✅ Mock data mode enabled!
    echo 📋 You can use these demo accounts:
    echo    Admin: admin@company.com / admin123
    echo    User:  user@company.com / user123
    
) else (
    echo ❌ Invalid choice. Please run the script again.
    exit /b 1
)

echo.
echo 🎉 Setup completed!
echo 🚀 Start the development server with: npm run dev
echo 🌐 Then visit: http://localhost:3000
pause
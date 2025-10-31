@echo off
echo 🔍 Checking OAuth Configuration...

REM Check if .env file exists
if not exist "server\.env" (
    echo ❌ server\.env file not found
    echo 📋 Copying from example...
    copy "server\.env.example" "server\.env" >nul
    echo ✅ Created server\.env from template
    echo ⚠️  Please edit server\.env with your actual API keys
) else (
    echo ✅ server\.env file exists
)

echo.
echo 🔧 Environment Variables Status:

REM Check Facebook
findstr /C:"your-facebook-app-id" "server\.env" >nul
if %errorlevel% equ 0 (
    echo ❌ Facebook: Not configured ^(using placeholder^)
) else (
    echo ✅ Facebook: Configured
)

REM Check LinkedIn
findstr /C:"your-linkedin-client-id" "server\.env" >nul
if %errorlevel% equ 0 (
    echo ❌ LinkedIn: Not configured ^(using placeholder^)
) else (
    echo ✅ LinkedIn: Configured
)

REM Check Twitter
findstr /C:"your-twitter-consumer-key" "server\.env" >nul
if %errorlevel% equ 0 (
    echo ❌ Twitter: Not configured ^(using placeholder^)
) else (
    echo ✅ Twitter: Configured
)

echo.
echo 📚 Setup Guides:
echo 📖 Facebook: docs\facebook-setup.md
echo 📖 LinkedIn: docs\linkedin-setup.md
echo 📖 Twitter: docs\twitter-setup.md

echo.
echo 🚀 Next Steps:
echo 1. Follow setup guides for each platform
echo 2. Update server\.env with real API keys
echo 3. Restart development server: npm run dev
echo 4. Test OAuth flows at http://localhost:3000/dashboard

pause

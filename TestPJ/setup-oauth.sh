#!/bin/bash

# OAuth Setup Verification Script
echo "🔍 Checking OAuth Configuration..."

# Check if .env file exists
if [ ! -f "server/.env" ]; then
    echo "❌ server/.env file not found"
    echo "📋 Copying from example..."
    cp server/.env.example server/.env
    echo "✅ Created server/.env from template"
    echo "⚠️  Please edit server/.env with your actual API keys"
else
    echo "✅ server/.env file exists"
fi

echo ""
echo "🔧 Environment Variables Status:"

# Check Facebook
if grep -q "your-facebook-app-id" server/.env; then
    echo "❌ Facebook: Not configured (using placeholder)"
else
    echo "✅ Facebook: Configured"
fi

# Check LinkedIn
if grep -q "your-linkedin-client-id" server/.env; then
    echo "❌ LinkedIn: Not configured (using placeholder)"
else
    echo "✅ LinkedIn: Configured"
fi

# Check Twitter
if grep -q "your-twitter-consumer-key" server/.env; then
    echo "❌ Twitter: Not configured (using placeholder)"
else
    echo "✅ Twitter: Configured"
fi

echo ""
echo "📚 Setup Guides:"
echo "📖 Facebook: docs/facebook-setup.md"
echo "📖 LinkedIn: docs/linkedin-setup.md" 
echo "📖 Twitter: docs/twitter-setup.md"

echo ""
echo "🚀 Next Steps:"
echo "1. Follow setup guides for each platform"
echo "2. Update server/.env with real API keys"
echo "3. Restart development server: npm run dev"
echo "4. Test OAuth flows at http://localhost:3000/dashboard"

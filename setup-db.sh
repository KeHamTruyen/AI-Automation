#!/bin/bash

echo "🚀 AI Marketing Engine Database Setup"
echo "===================================="
echo

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📋 Copying .env.example to .env..."
    cp .env.example .env
    echo "✅ .env file created"
fi

echo "Choose database setup option:"
echo "1) Use PostgreSQL (recommended for production)"
echo "2) Use Mock Data (no database required)"
echo

read -p "Enter your choice (1 or 2): " choice

case $choice in
    1)
        echo "🐘 Setting up PostgreSQL..."
        echo
        
        # Get PostgreSQL credentials
        read -p "PostgreSQL host (default: localhost): " pg_host
        pg_host=${pg_host:-localhost}
        
        read -p "PostgreSQL port (default: 5432): " pg_port
        pg_port=${pg_port:-5432}
        
        read -p "PostgreSQL username (default: postgres): " pg_user
        pg_user=${pg_user:-postgres}
        
        read -s -p "PostgreSQL password: " pg_password
        echo
        
        read -p "Database name (default: ai_marketing_engine): " pg_db
        pg_db=${pg_db:-ai_marketing_engine}
        
        # Update DATABASE_URL in .env
        database_url="postgresql://${pg_user}:${pg_password}@${pg_host}:${pg_port}/${pg_db}"
        
        # Use sed to update .env file
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s|^DATABASE_URL=.*|DATABASE_URL=\"$database_url\"|" .env
        else
            # Linux
            sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"$database_url\"|" .env
        fi
        
        echo "✅ Database URL updated in .env"
        echo
        echo "🔄 Running database setup..."
        
        # Generate Prisma client
        npm run db:generate
        
        # Push schema to database
        npm run db:push
        
        # Seed database
        npm run db:seed
        
        echo "✅ Database setup completed!"
        ;;
        
    2)
        echo "📝 Setting up Mock Data mode..."
        echo
        
        # Disable database by setting empty URL
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' 's|^DATABASE_URL=.*|DATABASE_URL=""|' .env
        else
            # Linux
            sed -i 's|^DATABASE_URL=.*|DATABASE_URL=""|' .env
        fi
        
        echo "✅ Mock data mode enabled!"
        echo "📋 You can use these demo accounts:"
        echo "   Admin: admin@company.com / admin123"
        echo "   User:  user@company.com / user123"
        ;;
        
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo
echo "🎉 Setup completed!"
echo "🚀 Start the development server with: npm run dev"
echo "🌐 Then visit: http://localhost:3000"

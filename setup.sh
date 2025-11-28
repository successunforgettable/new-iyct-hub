#!/bin/bash

# IYCT Platform - Easy Setup Script
# This script will set up your project automatically!

echo "🚀 IYCT Platform - Automatic Setup"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org first"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo "✅ NPM $(npm --version) detected"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from the iyct-platform-structured folder"
    exit 1
fi

echo "📦 Installing dependencies..."
echo "This will take 3-5 minutes..."
echo ""
npm install

if [ $? -ne 0 ]; then
    echo "❌ Installation failed!"
    exit 1
fi

echo ""
echo "✅ Dependencies installed!"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created!"
    echo ""
    echo "⚠️  IMPORTANT: You need to edit .env file and add:"
    echo "   - DATABASE_URL (from Supabase)"
    echo "   - JWT_SECRET (generate with: openssl rand -base64 32)"
    echo "   - JWT_REFRESH_SECRET (generate with: openssl rand -base64 32)"
    echo "   - ENCRYPTION_KEY (generate with: openssl rand -hex 32)"
    echo ""
else
    echo "✅ .env file already exists"
fi

echo ""
echo "=================================="
echo "🎉 Setup Complete!"
echo "=================================="
echo ""
echo "NEXT STEPS:"
echo ""
echo "1. Edit your .env file with database credentials"
echo "2. Set up your database:"
echo "   cd apps/backend"
echo "   npx prisma generate"
echo "   npx prisma migrate dev"
echo ""
echo "3. Start backend (Terminal 1):"
echo "   cd apps/backend"
echo "   npm run dev"
echo ""
echo "4. Start frontend (Terminal 2):"
echo "   cd apps/frontend"
echo "   npm run dev"
echo ""
echo "5. Open http://localhost:3000 in your browser!"
echo ""
echo "📖 For detailed instructions, see README.md"
echo ""

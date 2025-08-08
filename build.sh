#!/bin/bash
# Build script for Render deployment

echo "🚀 Starting build process..."

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Build frontend (if frontend folder exists)
if [ -d "frontend" ]; then
    echo "🎨 Building frontend..."
    cd frontend
    npm install
    npm run build
    cd ..
else
    echo "ℹ️  No frontend folder found, skipping frontend build"
fi

# Setup database
echo "🗄️  Setting up database..."
python setup_database.py

echo "✅ Build completed successfully!"
echo "🌐 Your portfolio is ready for deployment!"

#!/bin/bash

# Portfolio Website Setup Script

echo "🚀 Setting up Portfolio Website..."

# Backend setup
echo "📦 Setting up Python backend..."
cd /home/shoaib-shaikh/Desktop/portfolio-project/porfolio-backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating environment file..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your actual values!"
fi

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "📝 To run the backend:"
echo "   cd porfolio-backend"
echo "   source venv/bin/activate"
echo "   python app.py"
echo ""
echo "🌐 Backend will be available at: http://localhost:5000"
echo ""

# Frontend setup
echo "📦 Setting up React frontend..."
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
else
    echo "Node.js dependencies already installed."
fi

echo ""
echo "✅ Frontend setup complete!"
echo ""
echo "📝 To run the frontend:"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "🌐 Frontend will be available at: http://localhost:3000"
echo ""
echo "🎉 Portfolio website is ready!"
echo ""
echo "📋 Next steps:"
echo "1. Edit porfolio-backend/.env with your email credentials"
echo "2. Customize your information in porfolio-backend/app.py"
echo "3. Replace placeholder content with your actual projects and experience"
echo "4. Add your profile images to porfolio-backend/static/images/"
echo "5. Start both backend and frontend servers"
echo ""

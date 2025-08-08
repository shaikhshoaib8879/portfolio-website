#!/bin/bash

# Pre-deployment checklist and verification script
# Run this before deploying to Render

echo "🔍 Portfolio Deployment Checklist"
echo "================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Check functions
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ $1 exists${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ $1 missing${NC}"
        ((FAILED++))
        return 1
    fi
}

check_directory() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅ $1/ directory exists${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ $1/ directory missing${NC}"
        ((FAILED++))
        return 1
    fi
}

check_command() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✅ $1 is installed${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ $1 not found${NC}"
        ((FAILED++))
        return 1
    fi
}

check_env_file() {
    if [ -f ".env" ]; then
        echo -e "${GREEN}✅ .env file exists${NC}"
        
        # Check for required variables
        if grep -q "SECRET_KEY" .env; then
            echo -e "${GREEN}  ✅ SECRET_KEY found${NC}"
        else
            echo -e "${YELLOW}  ⚠️  SECRET_KEY not found in .env${NC}"
            ((WARNINGS++))
        fi
        
        if grep -q "MAIL_USERNAME" .env; then
            echo -e "${GREEN}  ✅ Email configuration found${NC}"
        else
            echo -e "${YELLOW}  ⚠️  Email not configured (contact form won't work)${NC}"
            ((WARNINGS++))
        fi
        
        ((PASSED++))
    else
        echo -e "${RED}❌ .env file missing${NC}"
        echo "  Create .env file with:"
        echo "  SECRET_KEY=your-secret-key"
        echo "  MAIL_USERNAME=your-email@gmail.com"
        echo "  MAIL_PASSWORD=your-app-password"
        ((FAILED++))
    fi
}

echo -e "${BLUE}1. Checking Required Files${NC}"
echo "-------------------------"
check_file "app.py"
check_file "requirements.txt"
check_file "render.yaml"
check_file "build.sh"
check_file "models.py"
check_env_file
echo ""

echo -e "${BLUE}2. Checking Frontend${NC}"
echo "-------------------"
check_directory "frontend"
if [ -d "frontend" ]; then
    cd frontend
    check_file "package.json"
    check_file "src/App.tsx"
    
    # Check if build command exists in package.json
    if grep -q '"build"' package.json; then
        echo -e "${GREEN}✅ Build script found in package.json${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ Build script missing in package.json${NC}"
        ((FAILED++))
    fi
    
    cd ..
fi
echo ""

echo -e "${BLUE}3. Checking Dependencies${NC}"
echo "------------------------"
check_command "python"
check_command "pip"
check_command "node"
check_command "npm"
echo ""

echo -e "${BLUE}4. Testing Backend Locally${NC}"
echo "-------------------------"
echo -e "${YELLOW}💡 Testing database setup...${NC}"
if python -c "
import sqlite3
from models import db, Developer, Skill, Project, Experience
from app import app

try:
    with app.app_context():
        db.create_all()
        # Check if tables exist
        developer_count = Developer.query.count()
        skills_count = Skill.query.count()
        projects_count = Project.query.count()
        experiences_count = Experience.query.count()
        
        print(f'Database tables created successfully!')
        print(f'Data: {developer_count} developer, {skills_count} skills, {projects_count} projects, {experiences_count} experiences')
    
except Exception as e:
    print(f'Database error: {e}')
    exit(1)
" 2>/dev/null; then
    echo -e "${GREEN}✅ Database setup successful${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Database setup failed${NC}"
    echo "  Run: python setup_database.py"
    ((FAILED++))
fi
echo ""

echo -e "${BLUE}5. Checking Git Repository${NC}"
echo "-------------------------"
if [ -d ".git" ]; then
    echo -e "${GREEN}✅ Git repository initialized${NC}"
    ((PASSED++))
    
    # Check if there are uncommitted changes
    if git status --porcelain | grep -q .; then
        echo -e "${YELLOW}⚠️  Uncommitted changes found${NC}"
        echo "  Run: git add . && git commit -m 'Ready for deployment'"
        ((WARNINGS++))
    else
        echo -e "${GREEN}✅ No uncommitted changes${NC}"
        ((PASSED++))
    fi
    
    # Check if connected to remote
    if git remote -v | grep -q "origin"; then
        echo -e "${GREEN}✅ Remote repository connected${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠️  No remote repository configured${NC}"
        echo "  Add remote: git remote add origin https://github.com/username/repo.git"
        ((WARNINGS++))
    fi
else
    echo -e "${RED}❌ Not a git repository${NC}"
    echo "  Initialize: git init"
    ((FAILED++))
fi
echo ""

echo -e "${BLUE}6. Frontend Build Test${NC}"
echo "---------------------"
if [ -d "frontend" ]; then
    cd frontend
    echo -e "${YELLOW}💡 Testing frontend build...${NC}"
    if npm run build > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend builds successfully${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ Frontend build failed${NC}"
        echo "  Run: cd frontend && npm install && npm run build"
        ((FAILED++))
    fi
    cd ..
else
    echo -e "${RED}❌ Frontend directory not found${NC}"
    ((FAILED++))
fi
echo ""

echo -e "${BLUE}7. Security Check${NC}"
echo "-----------------"
# Check if .env is in .gitignore
if [ -f ".gitignore" ] && grep -q ".env" .gitignore; then
    echo -e "${GREEN}✅ .env file is in .gitignore${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ .env file not in .gitignore${NC}"
    echo "  Add '.env' to .gitignore file"
    ((FAILED++))
fi

# Check for hardcoded secrets in code
if grep -r "password\|secret\|key" --include="*.py" --include="*.js" --include="*.tsx" . | grep -v ".env\|SECRET_KEY\|MAIL_PASSWORD" | grep -q "="; then
    echo -e "${YELLOW}⚠️  Potential hardcoded secrets found${NC}"
    echo "  Review your code for hardcoded passwords or keys"
    ((WARNINGS++))
else
    echo -e "${GREEN}✅ No obvious hardcoded secrets${NC}"
    ((PASSED++))
fi
echo ""

# Summary
echo -e "${BLUE}📊 Summary${NC}"
echo "=========="
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo -e "${GREEN}🎉 All checks passed! Ready for deployment!${NC}"
        echo ""
        echo -e "${BLUE}Next steps:${NC}"
        echo "1. Push to GitHub: git push origin main"
        echo "2. Go to render.com and create new Blueprint"
        echo "3. Connect your repository"
        echo "4. Set environment variables"
        echo "5. Deploy!"
    else
        echo -e "${YELLOW}⚠️  Ready for deployment with warnings${NC}"
        echo "Review the warnings above before deploying"
    fi
else
    echo -e "${RED}❌ Fix the failed checks before deploying${NC}"
    echo "Address the issues above and run this script again"
fi

echo ""
echo -e "${BLUE}📚 For detailed deployment guide:${NC}"
echo "Read RENDER_DEPLOYMENT_GUIDE.md"
echo ""

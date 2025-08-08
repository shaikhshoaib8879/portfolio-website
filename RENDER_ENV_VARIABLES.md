# 🔐 Render Environment Variables Configuration

## Required Environment Variables for Deployment

### Backend Service Variables

Set these in Render Dashboard → Your Backend Service → Environment Variables:

```bash
# Security (CRITICAL)
SECRET_KEY=generate-new-random-secret-key-in-render

# Email Configuration (for Contact Form)
MAIL_USERNAME=codeeshoaib@gmail.com
MAIL_PASSWORD=lizflgxnywpyphfo

# Application Settings
FLASK_ENV=production
PORT=5001

# Database (Auto-configured by Render - DO NOT SET MANUALLY)
DATABASE_URL=[Render will auto-populate this from your PostgreSQL database]
```

### Frontend Service Variables

Set these in Render Dashboard → Your Frontend Service → Environment Variables:

```bash
# API Connection
REACT_APP_API_BASE=https://your-backend-name.onrender.com/api

# Build Environment
NODE_ENV=production
```

## 🔧 Step-by-Step Configuration

### 1. Generate SECRET_KEY in Render
- Click "Generate" button next to SECRET_KEY field
- Render will create a secure random key

### 2. Email Configuration
- Use your existing Gmail credentials
- MAIL_USERNAME: codeeshoaib@gmail.com
- MAIL_PASSWORD: lizflgxnywpyphfo (your app-specific password)

### 3. Backend URL for Frontend
- After backend deploys, copy its URL
- Format: https://[your-backend-service-name].onrender.com/api
- Example: https://shoaib-portfolio-api.onrender.com/api

## 📝 Service Naming Convention

### Recommended Service Names:
- **Database**: `shoaib-portfolio-db`
- **Backend**: `shoaib-portfolio-api`  
- **Frontend**: `shoaib-portfolio-web`

### URLs after deployment:
- **API**: `https://shoaib-portfolio-api.onrender.com`
- **Website**: `https://shoaib-portfolio-web.onrender.com`
- **Custom Domain**: `https://shoaib-dev.com` (after setup)

## ⚠️ Security Notes

1. **Never commit real passwords to git**
2. **Use Render's environment variable system**
3. **Generate new SECRET_KEY for production**
4. **Gmail app password is already app-specific (secure)**

## 🔄 Deployment Order

Render will deploy in this order (automatic with Blueprint):
1. PostgreSQL Database
2. Backend Web Service  
3. Frontend Static Site

Database will be automatically connected to backend via DATABASE_URL.

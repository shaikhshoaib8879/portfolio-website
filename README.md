# Portfolio Website

A modern, responsive portfolio website built with React frontend and Python Flask backend.

## 🚀 Features

### Frontend (React + TypeScript)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Mode**: Toggle between themes with preference saving
- **Smooth Animations**: Framer Motion for engaging user interactions
- **Modern UI**: Glass morphism effects, gradients, and hover animations
- **SEO Optimized**: Meta tags and Open Graph support
- **Performance**: Optimized loading and lazy loading

### Backend (Python Flask)
- **RESTful API**: Clean API endpoints for all data
- **CORS Support**: Cross-origin resource sharing enabled
- **Contact Form**: Email integration for contact messages
- **Data Management**: JSON-based data storage (easily replaceable with database)
- **Error Handling**: Comprehensive error handling and validation

### Page Sections
- **Home**: Hero section with animated introduction
- **About**: Skills showcase with animated progress bars and experience timeline
- **Projects**: Featured and all projects with filtering
- **Contact**: Interactive contact form with validation

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons
- Axios for API calls

### Backend
- Python Flask
- Flask-CORS for cross-origin requests
- Flask-Mail for email functionality

## 📦 Installation & Setup

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd porfolio-backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

5. Run the Flask application:
   ```bash
   python app.py
   ```

The backend will be available at `http://localhost:5000`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## 🎨 Customization

### Personal Information
Update the developer information in `porfolio-backend/app.py`:
- `developer_info`: Personal details, contact information
- `skills`: Technical skills with proficiency levels
- `projects`: Portfolio projects with descriptions and links
- `experience`: Work experience and job history

### Styling
- **Colors**: Modify the color palette in `frontend/tailwind.config.js`
- **Animations**: Customize animations in `frontend/src/index.css`
- **Layout**: Adjust component layouts in the respective page files

### API Configuration
Update the API base URL in `frontend/src/utils/api.ts` for production deployment.

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/DigitalOcean)
1. Set environment variables in your hosting platform
2. Use `gunicorn` for production:
   ```bash
   gunicorn app:app
   ```

### Frontend Deployment (Netlify/Vercel)
1. Build the production version:
   ```bash
   npm run build
   ```
2. Deploy the `build` folder to your hosting platform
3. Set environment variables for API URL

## 📱 Responsive Design

The website is fully responsive and optimized for:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1440px+)

## ⚡ Performance Features

- **Lazy Loading**: Components load as needed
- **Image Optimization**: Optimized image loading
- **Code Splitting**: Automatic code splitting with React
- **Caching**: Browser caching for static assets
- **Minification**: Production builds are minified

## 🔧 Environment Variables

### Backend (.env)
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
SECRET_KEY=your-secret-key-here
FLASK_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## 📄 API Endpoints

- `GET /api/developer` - Get personal information
- `GET /api/skills` - Get skills list
- `GET /api/projects` - Get all projects
- `GET /api/projects?featured=true` - Get featured projects
- `GET /api/experience` - Get work experience
- `GET /api/stats` - Get portfolio statistics
- `POST /api/contact` - Send contact message

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 📧 Contact

Feel free to reach out if you have any questions or suggestions!

---

Made with ❤️ by [John Doe](https://github.com/johndoe)

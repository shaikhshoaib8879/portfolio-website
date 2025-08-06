from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_mail import Mail, Message
import os
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')

mail = Mail(app)

# Sample data - In a real application, this would come from a database
developer_info = {
    "name": "John Doe",
    "title": "Senior Software Developer",
    "experience_years": 3,
    "bio": "Passionate software developer with 3+ years of experience in full-stack development. Specialized in Python, JavaScript, React, and cloud technologies.",
    "email": "john.doe@example.com",
    "phone": "+1 (555) 123-4567",
    "location": "San Francisco, CA",
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe",
    "resume_url": "/static/resume.pdf"
}

skills = [
    {"name": "Python", "level": 90, "category": "Backend"},
    {"name": "JavaScript", "level": 85, "category": "Frontend"},
    {"name": "React", "level": 88, "category": "Frontend"},
    {"name": "Node.js", "level": 80, "category": "Backend"},
    {"name": "PostgreSQL", "level": 85, "category": "Database"},
    {"name": "MongoDB", "level": 75, "category": "Database"},
    {"name": "AWS", "level": 70, "category": "Cloud"},
    {"name": "Docker", "level": 75, "category": "DevOps"},
    {"name": "Git", "level": 90, "category": "Tools"},
    {"name": "HTML/CSS", "level": 92, "category": "Frontend"}
]

projects = [
    {
        "id": 1,
        "title": "E-Commerce Platform",
        "description": "Full-stack e-commerce solution with React frontend and Python backend",
        "technologies": ["React", "Python", "Flask", "PostgreSQL", "Stripe API"],
        "github_url": "https://github.com/johndoe/ecommerce-platform",
        "live_url": "https://ecommerce-demo.com",
        "image_url": "/static/images/ecommerce.jpg",
        "featured": True,
        "created_date": "2024-01-15"
    },
    {
        "id": 2,
        "title": "Task Management App",
        "description": "Collaborative task management application with real-time updates",
        "technologies": ["React", "Node.js", "Socket.io", "MongoDB"],
        "github_url": "https://github.com/johndoe/task-manager",
        "live_url": "https://taskapp-demo.com",
        "image_url": "/static/images/taskmanager.jpg",
        "featured": True,
        "created_date": "2023-08-20"
    },
    {
        "id": 3,
        "title": "Weather Dashboard",
        "description": "Beautiful weather dashboard with data visualization",
        "technologies": ["React", "D3.js", "OpenWeather API", "Tailwind CSS"],
        "github_url": "https://github.com/johndoe/weather-dashboard",
        "live_url": "https://weather-demo.com",
        "image_url": "/static/images/weather.jpg",
        "featured": False,
        "created_date": "2023-05-10"
    },
    {
        "id": 4,
        "title": "Machine Learning Model API",
        "description": "RESTful API for serving machine learning predictions",
        "technologies": ["Python", "FastAPI", "scikit-learn", "Docker"],
        "github_url": "https://github.com/johndoe/ml-api",
        "live_url": None,
        "image_url": "/static/images/ml-api.jpg",
        "featured": False,
        "created_date": "2023-12-05"
    }
]

experience = [
    {
        "id": 1,
        "title": "Senior Software Developer",
        "company": "Tech Solutions Inc.",
        "duration": "2023 - Present",
        "description": "Lead development of web applications using React and Python. Mentored junior developers and improved code quality by 40%.",
        "technologies": ["React", "Python", "AWS", "PostgreSQL"]
    },
    {
        "id": 2,
        "title": "Full Stack Developer",
        "company": "StartupXYZ",
        "duration": "2022 - 2023",
        "description": "Developed and maintained multiple client projects. Implemented CI/CD pipelines and reduced deployment time by 60%.",
        "technologies": ["JavaScript", "Node.js", "MongoDB", "Docker"]
    },
    {
        "id": 3,
        "title": "Junior Developer",
        "company": "WebDev Agency",
        "duration": "2021 - 2022",
        "description": "Worked on frontend development and API integration. Collaborated with design team to implement pixel-perfect UIs.",
        "technologies": ["HTML", "CSS", "JavaScript", "REST APIs"]
    }
]

# Routes
@app.route('/')
def home():
    return jsonify({"message": "Portfolio Backend API", "version": "1.0.0"})

@app.route('/api/developer')
def get_developer_info():
    return jsonify(developer_info)

@app.route('/api/skills')
def get_skills():
    return jsonify(skills)

@app.route('/api/projects')
def get_projects():
    featured_only = request.args.get('featured', 'false').lower() == 'true'
    if featured_only:
        featured_projects = [p for p in projects if p.get('featured', False)]
        return jsonify(featured_projects)
    return jsonify(projects)

@app.route('/api/projects/<int:project_id>')
def get_project(project_id):
    project = next((p for p in projects if p['id'] == project_id), None)
    if project:
        return jsonify(project)
    return jsonify({"error": "Project not found"}), 404

@app.route('/api/experience')
def get_experience():
    return jsonify(experience)

@app.route('/api/contact', methods=['POST'])
def contact():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')
        
        if not all([name, email, subject, message]):
            return jsonify({"error": "All fields are required"}), 400
        
        # In a real application, you would send an email here
        # For now, we'll just log it
        contact_data = {
            "name": name,
            "email": email,
            "subject": subject,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        
        # Save to a file (in a real app, use a database)
        try:
            with open('contacts.json', 'r') as f:
                contacts = json.load(f)
        except FileNotFoundError:
            contacts = []
        
        contacts.append(contact_data)
        
        with open('contacts.json', 'w') as f:
            json.dump(contacts, f, indent=2)
        
        return jsonify({"message": "Message sent successfully!"}), 200
        
    except Exception as e:
        return jsonify({"error": "Failed to send message"}), 500

@app.route('/api/stats')
def get_stats():
    stats = {
        "projects_completed": len(projects),
        "years_experience": developer_info["experience_years"],
        "technologies_used": len(skills),
        "github_repos": 25,
        "coffee_cups": 1247
    }
    return jsonify(stats)

# Serve static files
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

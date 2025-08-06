from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_mail import Mail, Message
from models import db, Developer, Skill, Project, Experience, Contact, SiteSettings
import os
from datetime import datetime
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///portfolio.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Mail configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')

# Initialize extensions
db.init_app(app)
mail = Mail(app)

# Routes
@app.route('/')
def home():
    return jsonify({"message": "Portfolio Backend API", "version": "2.0.0", "database": "SQLite"})

@app.route('/api/developer')
def get_developer_info():
    try:
        developer = Developer.query.first()
        if not developer:
            return jsonify({"error": "Developer information not found"}), 404
        return jsonify(developer.to_dict())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/skills')
def get_skills():
    try:
        featured_only = request.args.get('featured', 'false').lower() == 'true'
        
        if featured_only:
            skills = Skill.query.filter_by(is_featured=True).order_by(Skill.level.desc()).all()
        else:
            skills = Skill.query.order_by(Skill.category, Skill.level.desc()).all()
        
        return jsonify([skill.to_dict() for skill in skills])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/projects')
def get_projects():
    try:
        featured_only = request.args.get('featured', 'false').lower() == 'true'
        
        if featured_only:
            projects = Project.query.filter_by(featured=True).order_by(Project.created_at.desc()).all()
        else:
            projects = Project.query.order_by(Project.created_at.desc()).all()
        
        return jsonify([project.to_dict() for project in projects])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/projects/<int:project_id>')
def get_project(project_id):
    try:
        project = Project.query.get(project_id)
        if not project:
            return jsonify({"error": "Project not found"}), 404
        return jsonify(project.to_dict())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/experience')
def get_experience():
    try:
        experiences = Experience.query.order_by(Experience.start_date.desc()).all()
        return jsonify([exp.to_dict() for exp in experiences])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
        
        # Save contact message to database
        contact_message = Contact(
            name=name,
            email=email,
            subject=subject,
            message=message
        )
        db.session.add(contact_message)
        db.session.commit()
        
        # Optionally send email notification (if email is configured)
        if app.config['MAIL_USERNAME'] and app.config['MAIL_PASSWORD']:
            try:
                msg = Message(
                    subject=f"Portfolio Contact: {subject}",
                    sender=app.config['MAIL_USERNAME'],
                    recipients=[app.config['MAIL_USERNAME']],
                    body=f"""
New contact form submission:

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}
                    """
                )
                mail.send(msg)
            except Exception as email_error:
                print(f"Failed to send email notification: {email_error}")
        
        return jsonify({"message": "Message sent successfully!"}), 200
        
    except Exception as e:
        return jsonify({"error": "Failed to send message"}), 500

@app.route('/api/stats')
def get_stats():
    try:
        # Get basic counts from database
        projects_count = Project.query.count()
        developer = Developer.query.first()
        experience_years = developer.experience_years if developer else 0
        technologies_count = db.session.query(db.distinct(Skill.name)).count()
        
        # Get dynamic stats from site settings
        github_repos = SiteSettings.query.filter_by(key='github_repos_count').first()
        coffee_cups = SiteSettings.query.filter_by(key='coffee_cups_count').first()
        
        stats = {
            "projects_completed": projects_count,
            "years_experience": experience_years,
            "technologies_used": technologies_count,
            "github_repos": int(github_repos.value) if github_repos else 25,
            "coffee_cups": int(coffee_cups.value) if coffee_cups else 1247
        }
        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/contacts')
def get_contacts():
    """Admin endpoint to view contact messages"""
    try:
        contacts = Contact.query.order_by(Contact.created_at.desc()).all()
        return jsonify([contact.to_dict() for contact in contacts])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/contacts/<int:contact_id>/read', methods=['PUT'])
def mark_contact_read(contact_id):
    """Admin endpoint to mark contact as read"""
    try:
        contact = Contact.query.get(contact_id)
        if not contact:
            return jsonify({"error": "Contact not found"}), 404
        
        contact.is_read = True
        db.session.commit()
        return jsonify({"message": "Contact marked as read"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Serve static files
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

# Database initialization
def init_app():
    """Initialize the application"""
    with app.app_context():
        db.create_all()
        
        # Initialize with seed data if empty
        if not Developer.query.first():
            from init_db import init_database
            init_database()

if __name__ == '__main__':
    init_app()
    app.run(debug=True, port=5000)

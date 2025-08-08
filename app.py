from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_mail import Mail, Message
from models import db, Developer, Skill, Project, Technology, ProjectTechnology, Experience, ExperienceTechnology, Contact, SiteSettings
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
        category = request.args.get('category', '').strip()
        
        query = Skill.query
        
        if featured_only:
            query = query.filter_by(is_featured=True)
        
        if category and category.lower() != 'all':
            query = query.filter_by(category=category)
        
        skills = query.order_by(Skill.level.desc()).all()
        
        return jsonify([skill.to_dict() for skill in skills])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/skills/categories')
def get_skill_categories():
    try:
        categories = db.session.query(Skill.category).distinct().all()
        category_list = [cat[0] for cat in categories if cat[0]]  # Filter out None values
        return jsonify(sorted(category_list))
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

@app.route('/api/experiences')
def get_experiences():
    try:
        experiences = Experience.query.order_by(Experience.start_date.desc()).all()
        return jsonify([exp.to_dict() for exp in experiences])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/technologies')
def get_technologies():
    try:
        technologies = Technology.query.order_by(Technology.name).all()
        return jsonify([tech.to_dict() for tech in technologies])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/contact', methods=['POST'])
def contact():
    try:
        data = request.get_json()
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        subject = data.get('subject', '').strip()
        message = data.get('message', '').strip()
        
        if not all([name, email, subject, message]):
            return jsonify({"error": "All fields are required"}), 400
        
        # Basic email validation
        import re
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            return jsonify({"error": "Please provide a valid email address"}), 400
        
        # Save contact message to database
        contact_message = Contact(
            name=name,
            email=email,
            subject=subject,
            message=message
        )
        db.session.add(contact_message)
        db.session.commit()
        
        # Send email notification (if email is configured)
        if app.config['MAIL_USERNAME'] and app.config['MAIL_PASSWORD']:
            try:
                # Create HTML email template
                html_body = f"""
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                        .content {{ background: #f8f9fa; padding: 30px; border: 1px solid #e9ecef; }}
                        .field {{ margin-bottom: 20px; }}
                        .label {{ font-weight: bold; color: #495057; margin-bottom: 5px; display: block; }}
                        .value {{ background: white; padding: 10px; border-radius: 5px; border: 1px solid #dee2e6; }}
                        .message-box {{ background: white; padding: 20px; border-radius: 5px; border: 1px solid #dee2e6; white-space: pre-wrap; }}
                        .footer {{ background: #343a40; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }}
                        .timestamp {{ color: #6c757d; font-size: 14px; }}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🚀 New Portfolio Contact!</h1>
                            <p>Someone wants to connect with you</p>
                        </div>
                        <div class="content">
                            <div class="field">
                                <span class="label">👤 Name:</span>
                                <div class="value">{name}</div>
                            </div>
                            <div class="field">
                                <span class="label">📧 Email:</span>
                                <div class="value">{email}</div>
                            </div>
                            <div class="field">
                                <span class="label">📝 Subject:</span>
                                <div class="value">{subject}</div>
                            </div>
                            <div class="field">
                                <span class="label">💬 Message:</span>
                                <div class="message-box">{message}</div>
                            </div>
                            <div class="field">
                                <span class="label">🕒 Received:</span>
                                <div class="timestamp">{datetime.now().strftime('%B %d, %Y at %I:%M %p')}</div>
                            </div>
                        </div>
                        <div class="footer">
                            <p>Reply directly to this email to respond to {name}</p>
                            <p style="font-size: 12px; margin-top: 10px;">Sent from your portfolio website contact form</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                
                # Plain text fallback
                text_body = f"""
🚀 NEW PORTFOLIO CONTACT

👤 Name: {name}
📧 Email: {email} 
📝 Subject: {subject}
🕒 Received: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}

💬 Message:
{message}

---
Reply directly to this email to respond to {name}.
Sent from your portfolio website contact form.
                """
                
                msg = Message(
                    subject=f"🚀 Portfolio Contact: {subject}",
                    sender=app.config['MAIL_USERNAME'],
                    recipients=[app.config['MAIL_USERNAME']],
                    reply_to=email,  # Allow direct reply to the sender
                    body=text_body,
                    html=html_body
                )
                mail.send(msg)
                
                # Send confirmation email to the sender
                confirmation_html = f"""
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                        .content {{ background: #f8f9fa; padding: 30px; border: 1px solid #e9ecef; }}
                        .footer {{ background: #343a40; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✨ Message Received!</h1>
                            <p>Thanks for reaching out</p>
                        </div>
                        <div class="content">
                            <p>Hi {name}!</p>
                            <p>Thank you for your message about "<strong>{subject}</strong>". I've received your inquiry and I'm excited to connect with you!</p>
                            <p>I'll get back to you as soon as possible, usually within 24-48 hours.</p>
                            <p>In the meantime, feel free to:</p>
                            <ul>
                                <li>Check out my latest projects on the website</li>
                                <li>Connect with me on social media</li>
                                <li>Explore my GitHub repositories</li>
                            </ul>
                            <p>Looking forward to our collaboration!</p>
                            <p>Best regards,<br>Shoaib</p>
                        </div>
                        <div class="footer">
                            <p>This is an automated confirmation. Please don't reply to this email.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                
                confirmation_msg = Message(
                    subject=f"✨ Thanks for reaching out! - Message Received",
                    sender=app.config['MAIL_USERNAME'],
                    recipients=[email],
                    html=confirmation_html
                )
                mail.send(confirmation_msg)
                
            except Exception as email_error:
                print(f"Failed to send email notification: {email_error}")
                # Don't fail the request if email fails
        
        return jsonify({
            "message": "Message sent successfully! 🚀", 
            "success": True,
            "details": "I'll get back to you within 24-48 hours!"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Contact form error: {e}")
        return jsonify({"error": "Failed to send message. Please try again."}), 500

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
    with app.app_context():
        db.create_all()
    
    # Get port from environment variable (Render uses PORT)
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('FLASK_ENV', 'development') != 'production'
    
    app.run(host='0.0.0.0', port=port, debug=debug)

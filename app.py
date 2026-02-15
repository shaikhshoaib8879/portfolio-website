from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_mail import Mail, Message
from models import mongo, serialize_doc, calculate_duration
from bson.objectid import ObjectId
import os
from datetime import datetime
import re
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')

# MongoDB configuration
app.config['MONGO_URI'] = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/portfolio')

# Mail configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')

# Initialize extensions
mongo.init_app(app)
mail = Mail(app)


# ---------- Keep-alive (Render free tier) ----------
def keep_alive():
    """Ping the app's own URL every 30 seconds to prevent free-tier sleep."""
    import threading
    import urllib.request

    external_url = os.environ.get('RENDER_EXTERNAL_URL')
    if not external_url:
        return

    def _ping():
        while True:
            try:
                urllib.request.urlopen(external_url, timeout=10)
            except Exception:
                pass
            import time
            time.sleep(30)

    t = threading.Thread(target=_ping, daemon=True)
    t.start()
    print("Keep-alive thread started")


# ---------- Routes ----------

@app.route('/')
def home():
    return jsonify({
        "message": "Portfolio Backend API",
        "version": "3.0.0",
        "database": "MongoDB",
        "status": "running"
    })


@app.route('/api/developer')
def get_developer_info():
    try:
        developer = mongo.db.developer.find_one()
        if not developer:
            return jsonify({"error": "Developer information not found"}), 404
        return jsonify(serialize_doc(developer))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/skills')
def get_skills():
    try:
        featured_only = request.args.get('featured', 'false').lower() == 'true'
        category = request.args.get('category', '').strip()

        query = {}

        if featured_only:
            query['is_featured'] = True

        if category and category.lower() != 'all':
            query['category'] = category

        skills = list(mongo.db.skills.find(query).sort('level', -1))

        result = []
        for skill in skills:
            doc = serialize_doc(skill)
            # Add proficiency alias for frontend compatibility
            doc['proficiency'] = doc.get('level', 0)
            result.append(doc)

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/skills/categories')
def get_skill_categories():
    try:
        categories = mongo.db.skills.distinct('category')
        category_list = [cat for cat in categories if cat]
        return jsonify(sorted(category_list))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/projects')
def get_projects():
    try:
        featured_only = request.args.get('featured', 'false').lower() == 'true'

        query = {}
        if featured_only:
            query['featured'] = True

        projects = list(mongo.db.projects.find(query).sort('created_at', -1))

        result = []
        for project in projects:
            doc = serialize_doc(project)
            # Ensure dates are serialized
            if doc.get('start_date') and hasattr(doc['start_date'], 'isoformat'):
                doc['start_date'] = doc['start_date'].isoformat()
            if doc.get('end_date') and hasattr(doc['end_date'], 'isoformat'):
                doc['end_date'] = doc['end_date'].isoformat()
            if doc.get('created_at') and hasattr(doc['created_at'], 'isoformat'):
                doc['created_date'] = doc['created_at'].isoformat()
            elif doc.get('created_at'):
                doc['created_date'] = doc['created_at']
            # Ensure technologies is a list
            doc.setdefault('technologies', [])
            # Ensure images is a list
            doc.setdefault('images', [])
            result.append(doc)

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/projects/<project_id>')
def get_project(project_id):
    try:
        project = mongo.db.projects.find_one({'_id': ObjectId(project_id)})
        if not project:
            return jsonify({"error": "Project not found"}), 404
        doc = serialize_doc(project)
        if doc.get('start_date') and hasattr(doc['start_date'], 'isoformat'):
            doc['start_date'] = doc['start_date'].isoformat()
        if doc.get('end_date') and hasattr(doc['end_date'], 'isoformat'):
            doc['end_date'] = doc['end_date'].isoformat()
        if doc.get('created_at') and hasattr(doc['created_at'], 'isoformat'):
            doc['created_date'] = doc['created_at'].isoformat()
        doc.setdefault('technologies', [])
        doc.setdefault('images', [])
        return jsonify(doc)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/experience')
def get_experience():
    try:
        experiences = list(mongo.db.experience.find().sort('start_date', -1))

        result = []
        for exp in experiences:
            doc = serialize_doc(exp)
            # Serialize dates
            if doc.get('start_date') and hasattr(doc['start_date'], 'isoformat'):
                doc['start_date'] = doc['start_date'].isoformat()
            if doc.get('end_date') and hasattr(doc['end_date'], 'isoformat'):
                doc['end_date'] = doc['end_date'].isoformat()
            # Calculate duration
            doc['duration'] = calculate_duration(
                exp.get('start_date'),
                exp.get('end_date')
            )
            # Ensure lists
            doc.setdefault('technologies', [])
            doc.setdefault('achievements', [])
            result.append(doc)

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/experiences')
def get_experiences():
    return get_experience()


@app.route('/api/education')
def get_education():
    try:
        education = list(mongo.db.education.find().sort('start_date', -1))
        result = []
        for edu in education:
            doc = serialize_doc(edu)
            if doc.get('start_date') and hasattr(doc['start_date'], 'isoformat'):
                doc['start_date'] = doc['start_date'].isoformat()
            if doc.get('end_date') and hasattr(doc['end_date'], 'isoformat'):
                doc['end_date'] = doc['end_date'].isoformat()
            result.append(doc)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/certifications')
def get_certifications():
    try:
        certifications = list(mongo.db.certifications.find())
        return jsonify([serialize_doc(cert) for cert in certifications])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/achievements')
def get_achievements():
    try:
        achievements = list(mongo.db.achievements.find())
        return jsonify([serialize_doc(a) for a in achievements])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/technologies')
def get_technologies():
    try:
        technologies = list(mongo.db.technologies.find().sort('name', 1))
        return jsonify([serialize_doc(tech) for tech in technologies])
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
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            return jsonify({"error": "Please provide a valid email address"}), 400

        # Save contact message to database
        mongo.db.contacts.insert_one({
            'name': name,
            'email': email,
            'subject': subject,
            'message': message,
            'is_read': False,
            'is_replied': False,
            'created_at': datetime.utcnow()
        })

        # Send email notification (if email is configured)
        if app.config['MAIL_USERNAME'] and app.config['MAIL_PASSWORD']:
            try:
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
                            <h1>New Portfolio Contact!</h1>
                            <p>Someone wants to connect with you</p>
                        </div>
                        <div class="content">
                            <div class="field">
                                <span class="label">Name:</span>
                                <div class="value">{name}</div>
                            </div>
                            <div class="field">
                                <span class="label">Email:</span>
                                <div class="value">{email}</div>
                            </div>
                            <div class="field">
                                <span class="label">Subject:</span>
                                <div class="value">{subject}</div>
                            </div>
                            <div class="field">
                                <span class="label">Message:</span>
                                <div class="message-box">{message}</div>
                            </div>
                            <div class="field">
                                <span class="label">Received:</span>
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

                text_body = f"""
NEW PORTFOLIO CONTACT

Name: {name}
Email: {email}
Subject: {subject}
Received: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}

Message:
{message}

---
Reply directly to this email to respond to {name}.
Sent from your portfolio website contact form.
                """

                msg = Message(
                    subject=f"Portfolio Contact: {subject}",
                    sender=app.config['MAIL_USERNAME'],
                    recipients=[app.config['MAIL_USERNAME']],
                    reply_to=email,
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
                            <h1>Message Received!</h1>
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
                    subject="Thanks for reaching out! - Message Received",
                    sender=app.config['MAIL_USERNAME'],
                    recipients=[email],
                    html=confirmation_html
                )
                mail.send(confirmation_msg)

            except Exception as email_error:
                print(f"Failed to send email notification: {email_error}")

        return jsonify({
            "message": "Message sent successfully!",
            "success": True,
            "details": "I'll get back to you within 24-48 hours!"
        }), 200

    except Exception as e:
        print(f"Contact form error: {e}")
        return jsonify({"error": "Failed to send message. Please try again."}), 500


@app.route('/api/stats')
def get_stats():
    try:
        projects_count = mongo.db.projects.count_documents({})
        developer = mongo.db.developer.find_one()
        experience_years = developer.get('experience_years', 0) if developer else 0
        technologies_count = len(mongo.db.skills.distinct('name'))

        github_repos = mongo.db.site_settings.find_one({'key': 'github_repos_count'})
        coffee_cups = mongo.db.site_settings.find_one({'key': 'coffee_cups_count'})

        stats = {
            "projects_completed": projects_count,
            "years_experience": experience_years,
            "technologies_used": technologies_count,
            "github_repos": int(github_repos['value']) if github_repos else 25,
            "coffee_cups": int(coffee_cups['value']) if coffee_cups else 1247
        }
        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/admin/contacts')
def get_contacts():
    """Admin endpoint to view contact messages"""
    try:
        contacts = list(mongo.db.contacts.find().sort('created_at', -1))
        return jsonify([serialize_doc(c) for c in contacts])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/admin/contacts/<contact_id>/read', methods=['PUT'])
def mark_contact_read(contact_id):
    """Admin endpoint to mark contact as read"""
    try:
        result = mongo.db.contacts.update_one(
            {'_id': ObjectId(contact_id)},
            {'$set': {'is_read': True}}
        )
        if result.matched_count == 0:
            return jsonify({"error": "Contact not found"}), 404
        return jsonify({"message": "Contact marked as read"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Serve static files
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)


# Database initialization
def init_app():
    """Initialize the application with seed data if empty."""
    with app.app_context():
        if not mongo.db.developer.find_one():
            from init_db import init_database
            init_database()


# Initialize the database when the app starts (for production)
init_app()

# Start keep-alive thread in production
if os.environ.get('FLASK_ENV') == 'production':
    keep_alive()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('FLASK_ENV', 'development') != 'production'
    app.run(host='0.0.0.0', port=port, debug=debug)

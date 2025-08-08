#!/usr/bin/env python3
"""
Database Setup and Data Population Script
This script will initialize your database and populate it with your portfolio data.
"""

import os
import sys
from datetime import datetime
from flask import Flask
from models import db, Developer, Skill, Project, Technology, ProjectTechnology, Experience, ExperienceTechnology, SiteSettings
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///portfolio.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Handle PostgreSQL URL format for Render (psycopg v3 compatible)
    if app.config['SQLALCHEMY_DATABASE_URI'].startswith('postgres://'):
        app.config['SQLALCHEMY_DATABASE_URI'] = app.config['SQLALCHEMY_DATABASE_URI'].replace('postgres://', 'postgresql+psycopg://')
    elif 'postgresql://' in app.config['SQLALCHEMY_DATABASE_URI'] and '+psycopg' not in app.config['SQLALCHEMY_DATABASE_URI']:
        app.config['SQLALCHEMY_DATABASE_URI'] = app.config['SQLALCHEMY_DATABASE_URI'].replace('postgresql://', 'postgresql+psycopg://')
    
    db.init_app(app)
    return app

def init_database(app):
    """Initialize the database tables"""
    with app.app_context():
        print("🔨 Creating database tables...")
        db.create_all()
        print("✅ Database tables created successfully!")

def populate_developer_info(app):
    """Add developer information"""
    with app.app_context():
        print("👤 Adding developer information...")
        
        # Check if developer already exists
        developer = Developer.query.first()
        if developer:
            print("ℹ️  Developer info already exists, updating...")
            developer.name = "Shoaib Shaikh"
            developer.title = "Full Stack Developer & UI/UX Enthusiast"
            developer.experience_years = 3
            developer.bio = "Passionate full-stack developer with 3+ years of experience creating modern web applications. I specialize in React, Node.js, Python, and cloud technologies. I love turning complex problems into simple, beautiful solutions."
            developer.email = "codeeshoaib@gmail.com"
            developer.phone = "+91 9876543210"
            developer.location = "Mumbai, India"
            developer.linkedin = "https://linkedin.com/in/shoaib-shaikh"
            developer.github = "https://github.com/shaikhshoaib8879"
            developer.resume_url = "https://drive.google.com/file/d/your-resume-id/view"
        else:
            developer = Developer(
                name="Shoaib Shaikh",
                title="Full Stack Developer & UI/UX Enthusiast",
                experience_years=3,
                bio="Passionate full-stack developer with 3+ years of experience creating modern web applications. I specialize in React, Node.js, Python, and cloud technologies. I love turning complex problems into simple, beautiful solutions.",
                email="codeeshoaib@gmail.com",
                phone="+91 9876543210",
                location="Mumbai, India",
                linkedin="https://linkedin.com/in/shoaib-shaikh",
                github="https://github.com/shaikhshoaib8879",
                resume_url="https://drive.google.com/file/d/your-resume-id/view"
            )
            db.session.add(developer)
        
        db.session.commit()
        print("✅ Developer information added successfully!")

def populate_skills(app):
    """Add skills data"""
    with app.app_context():
        print("🚀 Adding skills...")
        
        skills_data = [
            # Frontend Skills
            {"name": "React.js", "category": "Frontend", "level": 90, "is_featured": True},
            {"name": "TypeScript", "category": "Frontend", "level": 85, "is_featured": True},
            {"name": "Next.js", "category": "Frontend", "level": 80, "is_featured": False},
            {"name": "Vue.js", "category": "Frontend", "level": 75, "is_featured": False},
            {"name": "HTML5", "category": "Frontend", "level": 95, "is_featured": True},
            {"name": "CSS3", "category": "Frontend", "level": 90, "is_featured": True},
            {"name": "Tailwind CSS", "category": "Frontend", "level": 85, "is_featured": True},
            {"name": "JavaScript", "category": "Frontend", "level": 90, "is_featured": True},
            
            # Backend Skills
            {"name": "Node.js", "category": "Backend", "level": 85, "is_featured": True},
            {"name": "Python", "category": "Backend", "level": 80, "is_featured": True},
            {"name": "Flask", "category": "Backend", "level": 75, "is_featured": True},
            {"name": "Express.js", "category": "Backend", "level": 85, "is_featured": True},
            {"name": "Ruby on Rails", "category": "Backend", "level": 80, "is_featured": False},
            
            # Database Skills
            {"name": "PostgreSQL", "category": "Database", "level": 80, "is_featured": True},
            {"name": "MongoDB", "category": "Database", "level": 75, "is_featured": True},
            {"name": "MySQL", "category": "Database", "level": 70, "is_featured": False},
            
            # DevOps & Tools
            {"name": "Git", "category": "DevOps", "level": 85, "is_featured": True},
            {"name": "Docker", "category": "DevOps", "level": 70, "is_featured": False},
            {"name": "AWS", "category": "DevOps", "level": 65, "is_featured": False}
        ]
        
        # Clear existing skills
        Skill.query.delete()
        
        for skill_data in skills_data:
            skill = Skill(**skill_data)
            db.session.add(skill)
        
        db.session.commit()
        print(f"✅ Added {len(skills_data)} skills successfully!")

def populate_technologies(app):
    """Add technologies data"""
    with app.app_context():
        print("🛠️  Adding technologies...")
        
        tech_data = [
            {"name": "React", "category": "Frontend"},
            {"name": "Vue.js", "category": "Frontend"},
            {"name": "Node.js", "category": "Backend"},
            {"name": "Express", "category": "Backend"},
            {"name": "Flask", "category": "Backend"},
            {"name": "MongoDB", "category": "Database"},
            {"name": "PostgreSQL", "category": "Database"},
            {"name": "Docker", "category": "DevOps"},
            {"name": "AWS", "category": "DevOps"},
            {"name": "Git", "category": "Tools"},
            {"name": "Ruby on Rails", "category": "Backend"},
            {"name": "JavaScript", "category": "Languages"},
            {"name": "Python", "category": "Languages"},
            {"name": "Ruby", "category": "Languages"},
            {"name": "TypeScript", "category": "Languages"}
        ]
        
        # Clear existing technologies
        Technology.query.delete()
        
        for tech in tech_data:
            technology = Technology(**tech)
            db.session.add(technology)
        
        db.session.commit()
        print(f"✅ Added {len(tech_data)} technologies successfully!")

def populate_projects(app):
    """Add project data"""
    with app.app_context():
        print("💼 Adding projects...")
        
        projects_data = [
            {
                "title": "Shopify Scraper Automation",
                "description": "A Flask-based web application to automate product metadata extraction from Shopify Excel inputs.",
                "detailed_description": "Designed and deployed a web application using Flask to automate extraction of product metadata from Shopify Excel inputs. Incorporated threaded scraping, real-time activity logs, SSO login, and CSV email delivery, replacing a manual process and reducing turnaround time by 80% for 10+ internal stakeholders.",
                "github_url": "https://github.com/shaikhshoaib8879/shopify-scraper",
                "live_url": "https://scrapper-application.onrender.com",
                "image_url": "https://via.placeholder.com/600x400/3b82f6/ffffff?text=Shopify+Scraper",
                "featured": True,
                "status": "completed",
                "start_date": "2023-01-15",
                "end_date": "2023-04-30",
                "technologies": ["Flask", "Python", "JavaScript"]
            },
            {
                "title": "E-Commerce Platform",
                "description": "A full-stack, scalable e-commerce platform and responsive UI.",
                "detailed_description": "Developed a full-stack e-commerce platform using Ruby on Rails and PostgreSQL, covering the entire user journey from browsing to checkout. Integrated Stripe for payments and used Tailwind CSS for a responsive UI. Optimized database queries and implemented pagination for performance at scale.",
                "github_url": "https://github.com/shaikhshoaib8879/ecommerce-platform",
                "live_url": "",
                "image_url": "https://via.placeholder.com/600x400/8b5cf6/ffffff?text=E-Commerce+Platform",
                "featured": True,
                "status": "completed",
                "start_date": "2022-07-01",
                "end_date": "2022-12-15",
                "technologies": ["Ruby on Rails", "PostgreSQL"]
            },
            {
                "title": "Portfolio Website",
                "description": "Modern portfolio website with advanced animations and interactive elements.",
                "detailed_description": "This very website! Built with React, TypeScript, and Framer Motion. Features include smooth animations, 3D effects, contact form with email integration, and responsive design.",
                "github_url": "https://github.com/shaikhshoaib8879/portfolio-website",
                "live_url": "https://shoaib-portfolio.onrender.com",
                "image_url": "https://via.placeholder.com/600x400/f59e0b/ffffff?text=Portfolio+Website",
                "featured": True,
                "status": "in-progress",
                "start_date": "2024-07-01",
                "technologies": ["React", "TypeScript", "Flask"]
            }
        ]
        
        # Clear existing projects
        Project.query.delete()
        
        for proj_data in projects_data:
            project = Project(
                title=proj_data["title"],
                description=proj_data["description"],
                detailed_description=proj_data.get("detailed_description"),
                github_url=proj_data.get("github_url"),
                live_url=proj_data.get("live_url"),
                image_url=proj_data["image_url"],
                featured=proj_data["featured"],
                status=proj_data["status"],
                start_date=datetime.strptime(proj_data["start_date"], "%Y-%m-%d").date(),
                end_date=datetime.strptime(proj_data["end_date"], "%Y-%m-%d").date() if proj_data.get("end_date") else None
            )
            db.session.add(project)
            db.session.flush()  # Get the project ID
            
            # Add project technologies
            for tech_name in proj_data["technologies"]:
                # Find or create technology
                technology = Technology.query.filter_by(name=tech_name).first()
                if not technology:
                    technology = Technology(name=tech_name, category="Other")
                    db.session.add(technology)
                    db.session.flush()
                
                # Link project and technology
                project_tech = ProjectTechnology(
                    project_id=project.id,
                    technology_id=technology.id
                )
                db.session.add(project_tech)
        
        db.session.commit()
        print(f"✅ Added {len(projects_data)} projects successfully!")

def main():
    print("🚀 Starting Portfolio Database Setup")
    print("=" * 50)
    
    app = create_app()
    
    try:
        # Initialize database
        init_database(app)
        
        # Populate data
        populate_developer_info(app)
        populate_skills(app)
        populate_technologies(app)
        populate_projects(app)
        
        print("\n" + "=" * 50)
        print("🎉 Database setup completed successfully!")
        print("✅ Your portfolio is ready to go!")
        print("\n📊 Summary:")
        
        with app.app_context():
            print(f"   • Developer profiles: {Developer.query.count()}")
            print(f"   • Skills: {Skill.query.count()}")
            print(f"   • Technologies: {Technology.query.count()}")
            print(f"   • Projects: {Project.query.count()}")
        
        print(f"\n🌐 Your portfolio database is ready!")
        print(f"🚀 You can now deploy to Render!")
        
    except Exception as e:
        print(f"\n❌ Error during database setup: {e}")
        print(f"💡 Debug info: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Seed script to populate the database with Shoaib Shaikh's real portfolio data
"""

import os
import json
from datetime import date
from flask import Flask
from models import db, Developer, Skill, Project, Technology, ProjectTechnology, Experience, ExperienceTechnology, SiteSettings
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create Flask app instance
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///portfolio.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database with app
db.init_app(app)

def seed_real_data():
    """Seed the database with Shoaib Shaikh's real portfolio data"""
    
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Check if data already exists and clear it
        if Developer.query.first():
            print("🔄 Database contains existing data. Clearing and reseeding...")
            # Clear existing data in proper order to avoid foreign key constraints
            db.session.query(ExperienceTechnology).delete()
            db.session.query(ProjectTechnology).delete() 
            db.session.query(SiteSettings).delete()
            db.session.query(Experience).delete()
            db.session.query(Project).delete()
            db.session.query(Skill).delete()
            db.session.query(Technology).delete()
            db.session.query(Developer).delete()
            db.session.commit()
        
        print("🚀 Seeding database with Shoaib Shaikh's real portfolio data...")
        
        # 1. Seed Developer Info
        developer = Developer(
            name="Shoaib Shaikh",
            title="Software Engineer",
            experience_years=3,
            bio="Full Stack Engineer with 3+ years of experience building scalable applications in Ruby on Rails, React, and Python. Led cross-functional initiatives that drove a 20% increase in customer acquisition and contributed to 22% of company revenue. Skilled in system design, CI/CD automation, and performance optimization, with a track record of reducing deployment times and increasing app stability.",
            email="shaikhshoaib8879@gmail.com",
            phone="+91 8879918846", 
            location="Mumbai, India",
            linkedin="https://linkedin.com/in/shaikh-shoaib-810b0a1b9",
            github="https://github.com/shaikhshoaib8879",
            resume_url="/static/resume.pdf",
            profile_image="/static/profile.jpg"
        )
        db.session.add(developer)
        
        # 2. Seed Technologies
        technologies_data = [
            # Languages
            {"name": "Ruby", "category": "Languages", "color": "#cc342d"},
            {"name": "JavaScript", "category": "Languages", "color": "#f7df1e"},
            {"name": "Python", "category": "Languages", "color": "#3776ab"},
            {"name": "Go", "category": "Languages", "color": "#00add8"},
            {"name": "Bash", "category": "Languages", "color": "#4eaa25"},
            {"name": "SQL", "category": "Languages", "color": "#336791"},
            
            # Backend Frameworks
            {"name": "Ruby on Rails", "category": "Backend", "color": "#cc0000"},
            {"name": "Flask", "category": "Backend", "color": "#000000"},
            {"name": "Django", "category": "Backend", "color": "#092e20"},
            
            # Frontend
            {"name": "React", "category": "Frontend", "color": "#61dafb"},
            {"name": "HTML5", "category": "Frontend", "color": "#e34f26"},
            {"name": "CSS3", "category": "Frontend", "color": "#1572b6"},
            {"name": "Tailwind CSS", "category": "Frontend", "color": "#06b6d4"},
            {"name": "Bootstrap", "category": "Frontend", "color": "#7952b3"},
            
            # Databases
            {"name": "PostgreSQL", "category": "Database", "color": "#336791"},
            {"name": "MongoDB", "category": "Database", "color": "#47a248"},
            {"name": "Redis", "category": "Database", "color": "#dc382d"},
            {"name": "MySQL", "category": "Database", "color": "#4479a1"},
            {"name": "Elasticsearch", "category": "Database", "color": "#005571"},
            
            # DevOps & Tools
            {"name": "Docker", "category": "DevOps", "color": "#2496ed"},
            {"name": "AWS", "category": "DevOps", "color": "#ff9900"},
            {"name": "Git", "category": "DevOps", "color": "#f05032"},
            {"name": "GitHub Actions", "category": "DevOps", "color": "#2088ff"},
            {"name": "Sidekiq", "category": "DevOps", "color": "#b91c1c"},
            
            # Additional
            {"name": "REST APIs", "category": "Backend", "color": "#02569b"},
            {"name": "Stripe", "category": "Integration", "color": "#008cdd"},
        ]
        
        tech_objects = {}
        for tech_data in technologies_data:
            tech = Technology(**tech_data)
            db.session.add(tech)
            tech_objects[tech_data["name"]] = tech
        
        db.session.flush()  # Flush to get IDs
        
        # 3. Seed Skills
        skills_data = [
            # Languages
            {"name": "Ruby", "level": 95, "category": "Languages", "is_featured": True},
            {"name": "JavaScript", "level": 92, "category": "Languages", "is_featured": True},
            {"name": "Python", "level": 88, "category": "Languages", "is_featured": True},
            {"name": "Go", "level": 75, "category": "Languages", "is_featured": False},
            {"name": "Bash", "level": 80, "category": "Languages", "is_featured": False},
            {"name": "SQL", "level": 90, "category": "Languages", "is_featured": True},
            
            # Frameworks & Libraries
            {"name": "Ruby on Rails", "level": 95, "category": "Backend", "is_featured": True},
            {"name": "React", "level": 90, "category": "Frontend", "is_featured": True},
            {"name": "Flask", "level": 85, "category": "Backend", "is_featured": False},
            {"name": "Django", "level": 80, "category": "Backend", "is_featured": False},
            {"name": "HTML5", "level": 95, "category": "Frontend", "is_featured": True},
            {"name": "CSS3", "level": 90, "category": "Frontend", "is_featured": True},
            {"name": "Tailwind CSS", "level": 88, "category": "Frontend", "is_featured": False},
            {"name": "Bootstrap", "level": 85, "category": "Frontend", "is_featured": False},
            
            # Databases
            {"name": "PostgreSQL", "level": 92, "category": "Database", "is_featured": True},
            {"name": "MongoDB", "level": 85, "category": "Database", "is_featured": False},
            {"name": "Redis", "level": 88, "category": "Database", "is_featured": False},
            {"name": "MySQL", "level": 85, "category": "Database", "is_featured": False},
            {"name": "Elasticsearch", "level": 80, "category": "Database", "is_featured": False},
            
            # DevOps & Tools
            {"name": "Docker", "level": 88, "category": "DevOps", "is_featured": True},
            {"name": "AWS", "level": 85, "category": "DevOps", "is_featured": True},
            {"name": "Git", "level": 95, "category": "DevOps", "is_featured": True},
            {"name": "GitHub Actions", "level": 85, "category": "DevOps", "is_featured": False},
            {"name": "Sidekiq", "level": 90, "category": "DevOps", "is_featured": False},
        ]
        
        for skill_data in skills_data:
            skill = Skill(**skill_data)
            db.session.add(skill)
        
        # 4. Seed Experience
        experience_data = [
            {
                "title": "Software Engineer",
                "company": "HowNow",
                "company_url": "https://gethownow.com",
                "location": "London, UK (Remote)",
                "employment_type": "full-time",
                "start_date": date(2024, 4, 1),
                "end_date": None,
                "description": "Leading development of AI-powered features using Ruby on Rails and React, achieving a 20% increase in customer acquisition. Automated highly manual processes in HowNow+ Premium, cutting engineering effort from 15 days to near-zero and contributing to 22% of company revenue. Mentored 2 junior developers and introduced Agile sprint retrospectives, improving team velocity by 15%.",
                "achievements": json.dumps([
                    "🚀 Achieved 20% increase in customer acquisition through AI-powered features",
                    "⚡ Automated HowNow+ Premium processes, reducing 15-day effort to near-zero",
                    "💰 Contributed to 22% of company revenue through process automation",
                    "👥 Mentored 2 junior developers, improving team capabilities",
                    "📈 Improved team velocity by 15% through Agile sprint retrospectives"
                ]),
                "is_current": True,
                "technologies": ["Ruby on Rails", "React", "PostgreSQL"]
            },
            {
                "title": "Full Stack Developer",
                "company": "Mirraw",
                "company_url": "https://mirraw.com",
                "location": "Mumbai, India",
                "employment_type": "full-time",
                "start_date": date(2022, 6, 1),
                "end_date": date(2024, 4, 1),
                "description": "Re-architected frontend for mobile responsiveness, eliminating separate mobile site and cutting AWS costs by 25%. Migrated background jobs to Sidekiq, improving processing speed and reducing server load by 30%. Designed automated invoicing and reporting tools resulting in 12% revenue increase. Modernized legacy APIs by replacing SOAP with RESTful services.",
                "achievements": json.dumps([
                    "🏗️ Re-architected frontend for mobile responsiveness",
                    "💰 Cut AWS costs by 25% by eliminating separate mobile site",
                    "⚡ Improved processing speed with Sidekiq migration",
                    "📊 Reduced server load by 30% through optimization",
                    "💸 Achieved 12% revenue increase with automated invoicing",
                    "🔄 Modernized legacy APIs from SOAP to RESTful services"
                ]),
                "is_current": False,
                "technologies": ["Ruby on Rails", "React", "PostgreSQL", "Sidekiq", "Docker", "AWS"]
            },
            {
                "title": "Bachelor of Engineering Student",
                "company": "Mumbai University",
                "company_url": "https://mu.ac.in",
                "location": "Mumbai, India",
                "employment_type": "education",
                "start_date": date(2019, 8, 1),
                "end_date": date(2022, 5, 1),
                "description": "Achieved 100/100 in Mathematics M3, demonstrating strong analytical skills. Served as Class Representative, coordinating initiatives for 60+ peers. Won multiple university-level competitions in quizzes, technical presentations, and debates. Led a team of four to develop project prototype and co-authored published technical paper.",
                "achievements": json.dumps([
                    "🎯 Achieved perfect 100/100 score in Mathematics M3",
                    "👥 Served as Class Representative for 60+ students",
                    "🏆 Won multiple university-level competitions",
                    "📝 Co-authored published technical paper",
                    "🔬 Led team of 4 in developing project prototype"
                ]),
                "is_current": False,
                "technologies": []
            }
        ]
        
        for exp_data in experience_data:
            technologies = exp_data.pop("technologies")
            experience = Experience(**exp_data)
            db.session.add(experience)
            
            # Add experience technologies
            for tech_name in technologies:
                if tech_name in tech_objects:
                    exp_tech = ExperienceTechnology(
                        experience=experience,
                        technology=tech_objects[tech_name]
                    )
                    db.session.add(exp_tech)
        
        # 5. Seed Projects
        projects_data = [
            {
                "title": "Shopify Scraper Automation",
                "description": "Designed and deployed a Flask-based web application to automate product metadata extraction from Shopify Excel inputs. Features include threaded scraping, real-time activity logs, SSO login, and CSV email delivery. Used by 10+ internal stakeholders, reducing turnaround time by 80%.",
                "detailed_description": "A comprehensive automation solution built with Flask and Python that revolutionized product data processing for e-commerce teams. The application features multi-threaded scraping capabilities, real-time progress monitoring, secure SSO authentication, and automated email delivery of processed data.",
                "github_url": "https://github.com/shaikhshoaib8879/shopify-scraper",
                "live_url": "https://shopify-scraper.herokuapp.com",
                "image_url": "/static/projects/shopify-scraper.jpg",
                "featured": True,
                "status": "completed",
                "start_date": date(2024, 1, 15),
                "end_date": date(2024, 3, 1),
                "technologies": ["Python", "Flask"]
            },
            {
                "title": "E-Commerce Platform",
                "description": "Built a full-stack, scalable e-commerce platform using Ruby on Rails and PostgreSQL. Covered entire user journey from browsing to checkout, integrated Stripe payments, and ensured responsive UI via Tailwind CSS. Optimized DB queries and implemented pagination for performance at scale.",
                "detailed_description": "A complete e-commerce solution with user authentication, product catalog management, shopping cart functionality, secure payment processing via Stripe, order management, and admin dashboard. Built with modern web technologies and optimized for performance.",
                "github_url": "https://github.com/shaikhshoaib8879/ecommerce-platform",
                "live_url": "https://ecommerce-demo.herokuapp.com",
                "image_url": "/static/projects/ecommerce-platform.jpg",
                "featured": True,
                "status": "completed",
                "start_date": date(2023, 6, 1),
                "end_date": date(2023, 9, 15),
                "technologies": ["Ruby on Rails", "PostgreSQL", "Tailwind CSS", "Redis", "Sidekiq"]
            },
            {
                "title": "Swiggy UI Clone (React)",
                "description": "Developed a frontend-only clone using React and real-time Swiggy APIs. Focused on component architecture, dynamic routing, and state management. Used as a learning platform for React principles and modern frontend design patterns.",
                "detailed_description": "A pixel-perfect clone of Swiggy's user interface built with React, showcasing advanced frontend development skills including component composition, state management, API integration, and responsive design principles.",
                "github_url": "https://github.com/shaikhshoaib8879/swiggy-clone",
                "live_url": "https://swiggy-clone-react.netlify.app",
                "image_url": "/static/projects/swiggy-clone.jpg",
                "featured": True,
                "status": "completed",
                "start_date": date(2023, 2, 1),
                "end_date": date(2023, 4, 15),
                "technologies": ["React", "JavaScript", "CSS3"]
            },
            {
                "title": "HowNow+ Premium Automation",
                "description": "Automated a highly manual, hardcoded module in HowNow+ Premium, cutting engineering effort from 15 days to near-zero. This automation enabled faster client onboarding and contributed to 22% of company revenue through improved efficiency.",
                "detailed_description": "A comprehensive automation solution that transformed manual processes into streamlined workflows, significantly reducing time-to-market and enabling scalable client onboarding for HowNow's premium offering.",
                "github_url": "https://github.com/shaikhshoaib8879/hownow-automation",
                "live_url": "https://hownow.com",
                "image_url": "/static/projects/hownow-automation.jpg",
                "featured": True,
                "status": "completed",
                "start_date": date(2024, 4, 1),
                "end_date": date(2024, 6, 30),
                "technologies": ["Ruby on Rails", "React", "PostgreSQL"]
            },
            {
                "title": "Mirraw Mobile Responsive Redesign",
                "description": "Re-architected the frontend for mobile responsiveness, eliminating the need for a separate mobile site and cutting AWS costs by 25%. Implemented modern responsive design patterns and optimized performance across all devices.",
                "detailed_description": "A complete frontend overhaul that modernized the user experience across all devices while significantly reducing infrastructure costs through architectural improvements.",
                "github_url": "https://github.com/shaikhshoaib8879/mirraw-responsive",
                "live_url": "https://mirraw.com",
                "image_url": "/static/projects/mirraw-responsive.jpg",
                "featured": False,
                "status": "completed",
                "start_date": date(2022, 8, 1),
                "end_date": date(2023, 1, 15),
                "technologies": ["Ruby on Rails", "CSS3", "JavaScript", "AWS"]
            },
            {
                "title": "Automated Invoicing & Reporting System",
                "description": "Designed and implemented automated invoicing and reporting tools in Ruby on Rails and PostgreSQL, resulting in a 12% increase in revenue. Features include automated invoice generation, payment tracking, and comprehensive reporting dashboards.",
                "detailed_description": "A complete business automation solution with invoice generation, payment processing, automated reminders, and comprehensive analytics dashboard for financial reporting and business intelligence.",
                "github_url": "https://github.com/shaikhshoaib8879/invoicing-system",
                "live_url": "https://invoicing-demo.herokuapp.com",
                "image_url": "/static/projects/invoicing-system.jpg",
                "featured": False,
                "status": "completed",
                "start_date": date(2022, 12, 1),
                "end_date": date(2023, 3, 30),
                "technologies": ["Ruby on Rails", "PostgreSQL"]
            }
        ]
        
        for proj_data in projects_data:
            technologies = proj_data.pop("technologies")
            project = Project(**proj_data)
            db.session.add(project)
            
            # Add project technologies
            for tech_name in technologies:
                if tech_name in tech_objects:
                    proj_tech = ProjectTechnology(
                        project=project,
                        technology=tech_objects[tech_name]
                    )
                    db.session.add(proj_tech)
        
        # 6. Seed Site Settings
        settings_data = [
            {"key": "site_title", "value": "Shoaib Shaikh - Software Engineer", "description": "Main site title"},
            {"key": "site_description", "value": "Full Stack Software Engineer with 3+ years of experience", "description": "Site meta description"},
            {"key": "hero_title", "value": "Hi, I'm Shoaib Shaikh", "description": "Hero section main title"},
            {"key": "hero_subtitle", "value": "Software Engineer", "description": "Hero section subtitle"},
            {"key": "hero_description", "value": "I build scalable applications and drive business growth through innovative solutions", "description": "Hero section description"},
            {"key": "contact_email", "value": "shaikhshoaib8879@gmail.com", "description": "Contact email address"},
            {"key": "contact_phone", "value": "+91 8879918846", "description": "Contact phone number"},
            {"key": "social_linkedin", "value": "https://linkedin.com/in/shaikh-shoaib-810b0a1b9", "description": "LinkedIn profile URL"},
            {"key": "social_github", "value": "https://github.com/shaikhshoaib8879", "description": "GitHub profile URL"},
        ]
        
        for setting_data in settings_data:
            setting = SiteSettings(**setting_data)
            db.session.add(setting)
        
        # Commit all changes
        db.session.commit()
        
        print("✅ Database successfully seeded with Shoaib Shaikh's real portfolio data!")
        print(f"   - Developer: {developer.name}")
        print(f"   - Skills: {len(skills_data)} skills")
        print(f"   - Technologies: {len(technologies_data)} technologies")
        print(f"   - Experience: {len(experience_data)} positions")
        print(f"   - Projects: {len(projects_data)} projects")
        print(f"   - Settings: {len(settings_data)} site settings")

if __name__ == "__main__":
    seed_real_data()

from models import db, Developer, Skill, Project, Technology, ProjectTechnology, Experience, ExperienceTechnology, SiteSettings
from datetime import date
import json

def init_database():
    """Initialize the database with tables and seed data"""
    
    # Create all tables
    db.create_all()
    
    # Check if data already exists
    if Developer.query.first():
        print("Database already initialized with data.")
        return
    
    print("Initializing database with seed data...")
    
    # Seed Developer Info
    developer = Developer(
        name="Shoaib Shaikh",
        title="Full Stack Developer",
        experience_years=3,
        bio="Passionate full-stack developer with 3+ years of experience in modern web development. Specialized in React, Node.js, Python Flask, and cloud technologies. Creating innovative solutions with clean, efficient code.",
        email="codeeshoaib@gmail.com",
        phone="+91 9876543210",
        location="Mumbai, India",
        linkedin="https://linkedin.com/in/shaikhshoaib8879",
        github="https://github.com/shaikhshoaib8879",
        resume_url="/static/resume.pdf"
    )
    db.session.add(developer)
    
    # Seed Technologies
    technologies_data = [
        {"name": "Python", "category": "backend", "color": "#3776ab"},
        {"name": "JavaScript", "category": "frontend", "color": "#f7df1e"},
        {"name": "React", "category": "frontend", "color": "#61dafb"},
        {"name": "Node.js", "category": "backend", "color": "#339933"},
        {"name": "PostgreSQL", "category": "database", "color": "#336791"},
        {"name": "MongoDB", "category": "database", "color": "#47a248"},
        {"name": "AWS", "category": "cloud", "color": "#ff9900"},
        {"name": "Docker", "category": "devops", "color": "#2496ed"},
        {"name": "Git", "category": "tools", "color": "#f05032"},
        {"name": "HTML/CSS", "category": "frontend", "color": "#e34f26"},
        {"name": "Flask", "category": "backend", "color": "#000000"},
        {"name": "TypeScript", "category": "frontend", "color": "#3178c6"},
        {"name": "Tailwind CSS", "category": "frontend", "color": "#06b6d4"},
        {"name": "FastAPI", "category": "backend", "color": "#009688"},
        {"name": "scikit-learn", "category": "ml", "color": "#f7931e"},
        {"name": "D3.js", "category": "frontend", "color": "#f68e56"},
        {"name": "OpenWeather API", "category": "api", "color": "#eb6e4b"},
        {"name": "Stripe API", "category": "api", "color": "#635bff"},
        {"name": "Socket.io", "category": "backend", "color": "#010101"}
    ]
    
    technologies = {}
    for tech_data in technologies_data:
        tech = Technology(**tech_data)
        db.session.add(tech)
        technologies[tech_data["name"]] = tech
    
    # Seed Skills
    skills_data = [
        {"name": "Python", "level": 90, "category": "Backend", "is_featured": True},
        {"name": "JavaScript", "level": 85, "category": "Frontend", "is_featured": True},
        {"name": "React", "level": 88, "category": "Frontend", "is_featured": True},
        {"name": "Node.js", "level": 80, "category": "Backend", "is_featured": False},
        {"name": "PostgreSQL", "level": 85, "category": "Database", "is_featured": True},
        {"name": "MongoDB", "level": 75, "category": "Database", "is_featured": False},
        {"name": "AWS", "level": 70, "category": "Cloud", "is_featured": False},
        {"name": "Docker", "level": 75, "category": "DevOps", "is_featured": False},
        {"name": "Git", "level": 90, "category": "Tools", "is_featured": True},
        {"name": "HTML/CSS", "level": 92, "category": "Frontend", "is_featured": True}
    ]
    
    for skill_data in skills_data:
        skill = Skill(**skill_data)
        db.session.add(skill)
    
    # Commit technologies and skills first so we can reference them
    db.session.commit()
    
    # Seed Projects
    projects_data = [
        {
            "title": "E-Commerce Platform",
            "description": "Full-stack e-commerce solution with React frontend and Python backend",
            "detailed_description": "A comprehensive e-commerce platform built with modern technologies. Features include user authentication, product catalog, shopping cart, payment processing with Stripe, order management, and admin dashboard. The backend is built with Flask and PostgreSQL, while the frontend uses React with TypeScript for a robust user experience.",
            "github_url": "https://github.com/johndoe/ecommerce-platform",
            "live_url": "https://ecommerce-demo.com",
            "image_url": "/static/images/ecommerce.jpg",
            "featured": True,
            "status": "completed",
            "start_date": date(2024, 1, 1),
            "end_date": date(2024, 1, 15),
            "technologies": ["React", "Python", "Flask", "PostgreSQL", "Stripe API"]
        },
        {
            "title": "Task Management App",
            "description": "Collaborative task management application with real-time updates",
            "detailed_description": "A modern task management application that enables teams to collaborate effectively. Features real-time updates using Socket.io, drag-and-drop task organization, team member assignment, deadline tracking, and progress monitoring. Built with React frontend and Node.js backend with MongoDB for data persistence.",
            "github_url": "https://github.com/johndoe/task-manager",
            "live_url": "https://taskapp-demo.com",
            "image_url": "/static/images/taskmanager.jpg",
            "featured": True,
            "status": "completed",
            "start_date": date(2023, 8, 1),
            "end_date": date(2023, 8, 20),
            "technologies": ["React", "Node.js", "Socket.io", "MongoDB"]
        },
        {
            "title": "Weather Dashboard",
            "description": "Beautiful weather dashboard with data visualization",
            "detailed_description": "An interactive weather dashboard that displays current conditions and forecasts with beautiful data visualizations. Features include location-based weather data, interactive charts using D3.js, responsive design with Tailwind CSS, and integration with OpenWeather API for real-time data.",
            "github_url": "https://github.com/johndoe/weather-dashboard",
            "live_url": "https://weather-demo.com",
            "image_url": "/static/images/weather.jpg",
            "featured": False,
            "status": "completed",
            "start_date": date(2023, 5, 1),
            "end_date": date(2023, 5, 10),
            "technologies": ["React", "D3.js", "OpenWeather API", "Tailwind CSS"]
        },
        {
            "title": "Machine Learning Model API",
            "description": "RESTful API for serving machine learning predictions",
            "detailed_description": "A robust API service for serving machine learning models in production. Built with FastAPI for high performance, includes model versioning, input validation, logging, monitoring, and Docker containerization for easy deployment. Uses scikit-learn for model implementation and supports multiple ML algorithms.",
            "github_url": "https://github.com/johndoe/ml-api",
            "live_url": None,
            "image_url": "/static/images/ml-api.jpg",
            "featured": False,
            "status": "completed",
            "start_date": date(2023, 12, 1),
            "end_date": date(2023, 12, 5),
            "technologies": ["Python", "FastAPI", "scikit-learn", "Docker"]
        }
    ]
    
    for project_data in projects_data:
        tech_names = project_data.pop("technologies")
        project = Project(**project_data)
        db.session.add(project)
        db.session.flush()  # Get the project ID
        
        # Add project technologies
        for tech_name in tech_names:
            if tech_name in technologies:
                project_tech = ProjectTechnology(
                    project_id=project.id,
                    technology_id=technologies[tech_name].id
                )
                db.session.add(project_tech)
    
    # Seed Experience
    experience_data = [
        {
            "title": "Senior Software Developer",
            "company": "Tech Solutions Inc.",
            "company_url": "https://techsolutions.com",
            "location": "San Francisco, CA",
            "employment_type": "full-time",
            "start_date": date(2023, 1, 1),
            "end_date": None,
            "description": "Lead development of web applications using React and Python. Mentored junior developers and improved code quality by 40%.",
            "achievements": json.dumps([
                "Led a team of 4 developers in building a customer portal that increased user engagement by 60%",
                "Implemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes",
                "Mentored 3 junior developers, with 2 receiving promotions within 6 months",
                "Architected microservices infrastructure serving 100k+ daily active users"
            ]),
            "is_current": True,
            "technologies": ["React", "Python", "AWS", "PostgreSQL"]
        },
        {
            "title": "Full Stack Developer",
            "company": "StartupXYZ",
            "company_url": "https://startupxyz.com",
            "location": "San Francisco, CA",
            "employment_type": "full-time",
            "start_date": date(2022, 1, 1),
            "end_date": date(2022, 12, 31),
            "description": "Developed and maintained multiple client projects. Implemented CI/CD pipelines and reduced deployment time by 60%.",
            "achievements": json.dumps([
                "Built 5 client applications serving 50k+ users combined",
                "Reduced application load times by 70% through optimization",
                "Implemented automated testing increasing code coverage to 85%",
                "Designed and built RESTful APIs used by mobile and web applications"
            ]),
            "is_current": False,
            "technologies": ["JavaScript", "Node.js", "MongoDB", "Docker"]
        },
        {
            "title": "Junior Developer",
            "company": "WebDev Agency",
            "company_url": "https://webdevagency.com",
            "location": "San Francisco, CA",
            "employment_type": "full-time",
            "start_date": date(2021, 6, 1),
            "end_date": date(2021, 12, 31),
            "description": "Worked on frontend development and API integration. Collaborated with design team to implement pixel-perfect UIs.",
            "achievements": json.dumps([
                "Delivered 15+ responsive web applications with 99% client satisfaction",
                "Collaborated with designers to implement complex UI/UX requirements",
                "Improved website performance scores by 40% through optimization",
                "Contributed to open-source projects gaining 200+ GitHub stars"
            ]),
            "is_current": False,
            "technologies": ["HTML/CSS", "JavaScript", "React"]
        }
    ]
    
    for exp_data in experience_data:
        tech_names = exp_data.pop("technologies")
        experience = Experience(**exp_data)
        db.session.add(experience)
        db.session.flush()  # Get the experience ID
        
        # Add experience technologies
        for tech_name in tech_names:
            if tech_name in technologies:
                exp_tech = ExperienceTechnology(
                    experience_id=experience.id,
                    technology_id=technologies[tech_name].id
                )
                db.session.add(exp_tech)
    
    # Seed Site Settings
    settings_data = [
        {"key": "site_title", "value": "John Doe - Portfolio", "description": "Website title"},
        {"key": "site_description", "value": "Professional portfolio of John Doe, Senior Software Developer", "description": "Website meta description"},
        {"key": "github_repos_count", "value": "25", "description": "Number of GitHub repositories"},
        {"key": "coffee_cups_count", "value": "1247", "description": "Coffee cups consumed (fun stat)"},
        {"key": "analytics_id", "value": "", "description": "Google Analytics measurement ID"},
        {"key": "contact_email", "value": "john.doe@example.com", "description": "Contact email address"},
        {"key": "resume_url", "value": "/static/resume.pdf", "description": "Resume file URL"}
    ]
    
    for setting_data in settings_data:
        setting = SiteSettings(**setting_data)
        db.session.add(setting)
    
    # Commit all changes
    db.session.commit()
    
    print("Database initialized successfully with seed data!")
    print("\nDatabase contains:")
    print(f"- {Developer.query.count()} developer profile")
    print(f"- {Technology.query.count()} technologies")
    print(f"- {Skill.query.count()} skills")
    print(f"- {Project.query.count()} projects")
    print(f"- {Experience.query.count()} work experiences")
    print(f"- {SiteSettings.query.count()} site settings")

if __name__ == "__main__":
    from app import app
    with app.app_context():
        init_database()

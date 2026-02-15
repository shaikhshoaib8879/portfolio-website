from models import mongo
from datetime import datetime


def init_database():
    """Drop all collections, then seed fresh data for Shoaib Shaikh."""

    # Drop existing collections
    mongo.db.developer.drop()
    mongo.db.technologies.drop()
    mongo.db.skills.drop()
    mongo.db.projects.drop()
    mongo.db.experience.drop()
    mongo.db.education.drop()
    mongo.db.certifications.drop()
    mongo.db.achievements.drop()
    mongo.db.site_settings.drop()

    print("Collections dropped. Inserting fresh seed data...")

    # Seed Developer Info
    mongo.db.developer.insert_one({
        "name": "Shoaib Shaikh",
        "title": "Backend-focused Software Engineer",
        "experience_years": 3,
        "bio": (
            "Motivated to pursue international studies to gain global exposure and advanced technical "
            "insight within a multicultural academic environment. Aiming to develop strong analytical, "
            "collaborative, and innovation-driven capabilities while building a global perspective that "
            "supports long-term professional growth and meaningful contribution to technology-driven societies."
        ),
        "email": "shaikhshoaib8879@gmail.com",
        "phone": "(+91) 8879918846",
        "location": "Mumbai, India",
        "linkedin": "https://www.linkedin.com/in/shaikh-shoaib-810b0a1b9",
        "github": "https://github.com/shaikhshoaib8879",
        "resume_url": "https://drive.google.com/file/d/1Mhy5WgCc2uL4JoopxvcVOATbDuHNx7Ko/view?usp=drive_link",
        "profile_image": None,
        "languages": {
            "mother_tongue": "Hindi",
            "other": [
                {
                    "language": "English",
                    "listening": "C2",
                    "reading": "C1",
                    "writing": "B2",
                    "spoken_production": "B2",
                    "spoken_interaction": "B2",
                },
            ],
        },
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    })

    # Seed Technologies
    mongo.db.technologies.insert_many([
        {"name": "Ruby", "category": "backend", "color": "#CC342D"},
        {"name": "Ruby on Rails", "category": "backend", "color": "#CC0000"},
        {"name": "Python", "category": "backend", "color": "#3776AB"},
        {"name": "Flask", "category": "backend", "color": "#000000"},
        {"name": "Django", "category": "backend", "color": "#092E20"},
        {"name": "Go", "category": "backend", "color": "#00ADD8"},
        {"name": "REST API", "category": "api", "color": "#111111"},
        {"name": "API Development", "category": "api", "color": "#333333"},
        {"name": "Microservices", "category": "backend", "color": "#7F8C8D"},
        {"name": "JavaScript", "category": "frontend", "color": "#F7DF1E"},
        {"name": "React", "category": "frontend", "color": "#61DAFB"},
        {"name": "HTML5", "category": "frontend", "color": "#E34F26"},
        {"name": "CSS3", "category": "frontend", "color": "#1572B6"},
        {"name": "Tailwind CSS", "category": "frontend", "color": "#06B6D4"},
        {"name": "Bootstrap", "category": "frontend", "color": "#7952B3"},
        {"name": "PostgreSQL", "category": "database", "color": "#336791"},
        {"name": "MongoDB", "category": "database", "color": "#47A248"},
        {"name": "Redis", "category": "database", "color": "#DC382D"},
        {"name": "MySQL", "category": "database", "color": "#4479A1"},
        {"name": "Elasticsearch", "category": "database", "color": "#005571"},
        {"name": "AWS", "category": "cloud", "color": "#FF9900"},
        {"name": "Docker", "category": "devops", "color": "#2496ED"},
        {"name": "GitHub Actions", "category": "devops", "color": "#2088FF"},
        {"name": "GitHub Copilot", "category": "tools", "color": "#000000"},
        {"name": "CI/CD", "category": "devops", "color": "#666666"},
        {"name": "Sidekiq", "category": "backend", "color": "#D60000"},
        {"name": "Stripe API", "category": "api", "color": "#635BFF"},
        {"name": "Razorpay", "category": "api", "color": "#0C3064"},
        {"name": "Unbxd", "category": "tools", "color": "#FF6F00"},
        {"name": "System Design", "category": "practices", "color": "#2C3E50"},
        {"name": "TDD", "category": "practices", "color": "#8E44AD"},
        {"name": "Agile", "category": "practices", "color": "#27AE60"},
        {"name": "Scrum", "category": "practices", "color": "#2980B9"},
    ])

    # Seed Skills (Technical + Interpersonal)
    mongo.db.skills.insert_many([
        # Technical Skills
        {"name": "Ruby on Rails", "level": 90, "category": "Backend", "is_featured": True},
        {"name": "Ruby", "level": 88, "category": "Backend", "is_featured": False},
        {"name": "React", "level": 85, "category": "Frontend", "is_featured": True},
        {"name": "Python", "level": 85, "category": "Backend", "is_featured": True},
        {"name": "Flask", "level": 80, "category": "Backend", "is_featured": False},
        {"name": "Django", "level": 78, "category": "Backend", "is_featured": False},
        {"name": "JavaScript (ES6+)", "level": 85, "category": "Frontend", "is_featured": True},
        {"name": "HTML5", "level": 90, "category": "Frontend", "is_featured": True},
        {"name": "CSS3", "level": 88, "category": "Frontend", "is_featured": False},
        {"name": "Tailwind CSS", "level": 85, "category": "Frontend", "is_featured": False},
        {"name": "Bootstrap", "level": 82, "category": "Frontend", "is_featured": False},
        {"name": "PostgreSQL", "level": 85, "category": "Database", "is_featured": True},
        {"name": "MongoDB", "level": 75, "category": "Database", "is_featured": False},
        {"name": "MySQL", "level": 78, "category": "Database", "is_featured": False},
        {"name": "Redis", "level": 75, "category": "Database", "is_featured": False},
        {"name": "Elasticsearch", "level": 70, "category": "Database", "is_featured": False},
        {"name": "AWS", "level": 75, "category": "Cloud", "is_featured": False},
        {"name": "Docker", "level": 80, "category": "DevOps", "is_featured": False},
        {"name": "GitHub Actions", "level": 70, "category": "DevOps", "is_featured": False},
        {"name": "GitHub Copilot", "level": 80, "category": "Tools", "is_featured": False},
        {"name": "API Development", "level": 88, "category": "Backend", "is_featured": False},
        {"name": "System Design", "level": 78, "category": "Backend", "is_featured": False},
        # Interpersonal Skills
        {"name": "Adaptive Teamwork", "level": 90, "category": "Interpersonal", "is_featured": False},
        {"name": "Problem Solving", "level": 92, "category": "Interpersonal", "is_featured": True},
        {"name": "Situational Forecasting", "level": 80, "category": "Interpersonal", "is_featured": False},
        {"name": "Stakeholder Management", "level": 82, "category": "Interpersonal", "is_featured": False},
        {"name": "Critical Thinking", "level": 88, "category": "Interpersonal", "is_featured": False},
        {"name": "Process Optimization", "level": 85, "category": "Interpersonal", "is_featured": False},
        {"name": "Strategic Supervision", "level": 78, "category": "Interpersonal", "is_featured": False},
        {"name": "Cognitive Agility", "level": 85, "category": "Interpersonal", "is_featured": False},
    ])

    # Seed Projects
    mongo.db.projects.insert_many([
        {
            "title": "Portfolio Website",
            "description": (
                "Developed a full-stack personal portfolio using Flask and React with a responsive UI "
                "to showcase skills and projects."
            ),
            "detailed_description": (
                "Developed a full-stack personal portfolio using Flask and React with a responsive UI to "
                "showcase skills and projects, and implemented CI/CD pipelines to automate build, testing, "
                "and deployment for faster, more reliable releases."
            ),
            "github_url": "https://github.com/shaikhshoaib8879/portfolio-website",
            "live_url": "https://shoaib-portfolio-web-1k6v.onrender.com/",
            "image_url": "/static/images/portfolio.jpg",
            "featured": True,
            "status": "completed",
            "start_date": None,
            "end_date": None,
            "technologies": ["Flask", "React", "Tailwind CSS", "CI/CD"],
            "images": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        },
        {
            "title": "Finbox Application",
            "description": (
                "Engineered a real estate payment automation platform with Razorpay integration."
            ),
            "detailed_description": (
                "Engineered a real estate payment automation platform with Razorpay integration, "
                "automating buyer reminders and financial workflows to enable secure transactions "
                "and improve efficiency, accuracy, and client satisfaction."
            ),
            "github_url": None,
            "live_url": None,
            "image_url": "/static/images/finbox.jpg",
            "featured": True,
            "status": "completed",
            "start_date": None,
            "end_date": None,
            "technologies": ["Ruby on Rails", "PostgreSQL", "Razorpay", "Docker"],
            "images": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        },
        {
            "title": "Scraper Automation",
            "description": (
                "Built a scalable Flask-based data extraction application with threaded architecture."
            ),
            "detailed_description": (
                "Built a scalable Flask-based data extraction application with threaded architecture for "
                "automated product metadata scraping, and integrated secure Single Sign-On (SSO) with "
                "real-time CSV report generation, reducing manual processing effort by over 80%."
            ),
            "github_url": None,
            "live_url": "https://scrapper-application.onrender.com/",
            "image_url": "/static/images/scraper.jpg",
            "featured": True,
            "status": "completed",
            "start_date": None,
            "end_date": None,
            "technologies": ["Flask", "Python", "Docker"],
            "images": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        },
        {
            "title": "E-Commerce Platform",
            "description": (
                "Developed and deployed a high-performance e-commerce application using Ruby on Rails."
            ),
            "detailed_description": (
                "Developed and deployed a high-performance e-commerce application using Ruby on Rails, "
                "PostgreSQL, and Stripe for secure payments, while optimizing backend queries and frontend "
                "responsiveness with Tailwind CSS to achieve scalable, production-ready performance."
            ),
            "github_url": None,
            "live_url": None,
            "image_url": "/static/images/ecommerce.jpg",
            "featured": False,
            "status": "completed",
            "start_date": None,
            "end_date": None,
            "technologies": ["Ruby on Rails", "PostgreSQL", "Stripe API", "Tailwind CSS"],
            "images": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        },
        {
            "title": "Swiggy UI Clone",
            "description": (
                "Recreated Swiggy's user interface as a responsive React web application."
            ),
            "detailed_description": (
                "Recreated Swiggy's user interface as a responsive React web application, emphasizing "
                "component reusability, effective state management, and asynchronous data handling to "
                "demonstrate real-world product design and API integration skills."
            ),
            "github_url": None,
            "live_url": None,
            "image_url": "/static/images/swiggy-clone.jpg",
            "featured": False,
            "status": "completed",
            "start_date": None,
            "end_date": None,
            "technologies": ["React", "JavaScript", "REST API"],
            "images": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        },
    ])

    # Seed Experience
    mongo.db.experience.insert_many([
        {
            "title": "Software Engineer",
            "company": "Hownow",
            "company_url": None,
            "location": "Mumbai, India",
            "employment_type": "full-time",
            "start_date": datetime(2024, 4, 1),
            "end_date": None,
            "description": (
                "Built and delivered high-impact features using Rails and React, led AI-driven initiatives "
                "including AI Guru and AI Analyst, and designed event-driven tracking systems for user behavior analysis."
            ),
            "achievements": [
                "Built and delivered high-impact features using Rails and React, enabling onboarding of 50+ enterprise clients and directly supporting ARR growth, client acquisition, and faster time-to-value through automated workflows and third-party API integrations.",
                "Led AI-driven initiatives including AI Guru and AI Analyst, enhancing the in-house RAG system to provide accurate, contextual learning insights, personalized skill-gap analysis, and instant learning pathways, improving engagement and product intelligence.",
                "Designed event-driven tracking systems to analyze user behavior and retention, served as the primary engineer for production issues and escalations, and independently developed an internal CX platform that improved cross-team visibility and reduced delivery timelines by 15%.",
            ],
            "is_current": True,
            "technologies": ["Ruby on Rails", "React", "AWS", "Docker", "PostgreSQL", "REST API"],
            "created_at": datetime.utcnow(),
        },
        {
            "title": "Full Stack Developer",
            "company": "Mirraw",
            "company_url": None,
            "location": "Mumbai, India",
            "employment_type": "full-time",
            "start_date": datetime(2022, 6, 1),
            "end_date": datetime(2024, 4, 1),
            "description": (
                "Led core platform modernization including search migration, background processing optimization, "
                "API upgrades, and full UI transformation unifying mobile and desktop platforms."
            ),
            "achievements": [
                "Led core platform modernization by migrating search from Solr to Unbxd for improved relevance and performance, transitioning background jobs to Sidekiq to reduce server costs by 12%, and upgrading APIs from SOAP to REST with logistics integrations for real-time order tracking and faster deliveries.",
                "Delivered revenue-driving features including delivery charge logic, advertising modules, vendor catalog panels, and personalized recommendations, while optimizing deployments through Docker enhancements, zero-downtime releases, and migrating a Flask microservice to Rails to lower infrastructure overhead.",
                "Played a key role in a full UI transformation by unifying mobile and desktop platforms into a single responsive system, reducing AWS and maintenance costs, and built financial automation tools for vendor payments and reporting, minimizing manual effort and improving operational accuracy.",
            ],
            "is_current": False,
            "technologies": ["Ruby on Rails", "Sidekiq", "Docker", "Unbxd", "REST API", "PostgreSQL"],
            "created_at": datetime.utcnow(),
        },
    ])

    # Seed Education
    mongo.db.education.insert_many([
        {
            "degree": "Bachelor of Engineering in Mechanical Engineering",
            "institution": "University of Mumbai",
            "location": "Mumbai, India",
            "start_date": datetime(2019, 5, 1),
            "end_date": datetime(2022, 6, 1),
            "grade": "9.04 CGPA",
            "created_at": datetime.utcnow(),
        },
        {
            "degree": "Diploma in Mechanical Engineering",
            "institution": "Maharashtra State Board of Technical Education",
            "location": "Mumbai, India",
            "start_date": datetime(2016, 5, 1),
            "end_date": datetime(2019, 6, 1),
            "grade": "85.94%",
            "created_at": datetime.utcnow(),
        },
        {
            "degree": "Secondary School Certificate (SSC)",
            "institution": "Maharashtra State Board of Secondary and Higher Secondary Education",
            "location": "Mumbai, India",
            "start_date": datetime(2015, 4, 1),
            "end_date": datetime(2016, 5, 1),
            "grade": "88.20%",
            "created_at": datetime.utcnow(),
        },
    ])

    # Seed Certifications
    mongo.db.certifications.insert_many([
        {
            "name": "Namaste React",
            "issuer": "Akshay Saini",
            "created_at": datetime.utcnow(),
        },
        {
            "name": "Namaste DSA",
            "issuer": "Akshay Saini",
            "created_at": datetime.utcnow(),
        },
        {
            "name": "Python Django - Dev to Deployment",
            "issuer": None,
            "created_at": datetime.utcnow(),
        },
    ])

    # Seed Achievements
    mongo.db.achievements.insert_many([
        {
            "description": "Improved page load performance by 0.3s, enhancing SEO and user experience.",
            "category": "performance",
            "created_at": datetime.utcnow(),
        },
        {
            "description": "Reduced AWS infrastructure costs by 25% and server costs by 12% through architectural optimizations.",
            "category": "infrastructure",
            "created_at": datetime.utcnow(),
        },
        {
            "description": "Increased client acquisition and retention via delivery of enterprise-grade features in Rails and React.",
            "category": "business",
            "created_at": datetime.utcnow(),
        },
        {
            "description": "Successfully migrated search from Solr to Unbxd, boosting customer engagement and marketing ROI.",
            "category": "engineering",
            "created_at": datetime.utcnow(),
        },
        {
            "description": "Scored 100/100 in Mathematics (M3) in engineering, showcasing strong analytical ability.",
            "category": "academic",
            "created_at": datetime.utcnow(),
        },
        {
            "description": "Winner of university-level quiz, debate, and technical competitions.",
            "category": "extracurricular",
            "created_at": datetime.utcnow(),
        },
    ])

    # Seed Site Settings
    mongo.db.site_settings.insert_many([
        {"key": "site_title", "value": "Shoaib Shaikh - Portfolio", "description": "Website title"},
        {
            "key": "site_description",
            "value": (
                "Backend-focused Software Engineer with 3+ years building scalable web apps, APIs, and data-driven features. "
                "Rails - React - Python - AWS - Docker"
            ),
            "description": "Website meta description",
        },
        {"key": "github_repos_count", "value": "25", "description": "Number of GitHub repositories (display only)"},
        {"key": "coffee_cups_count", "value": "1247", "description": "Coffee cups consumed (fun stat)"},
        {"key": "analytics_id", "value": "", "description": "Google Analytics measurement ID"},
        {"key": "contact_email", "value": "shaikhshoaib8879@gmail.com", "description": "Contact email address"},
        {
            "key": "resume_url",
            "value": "https://drive.google.com/file/d/1Mhy5WgCc2uL4JoopxvcVOATbDuHNx7Ko/view?usp=drive_link",
            "description": "Resume file URL",
        },
    ])

    print("Database seeded successfully!")
    print(f"\nDatabase contains:")
    print(f"- {mongo.db.developer.count_documents({})} developer profile")
    print(f"- {mongo.db.technologies.count_documents({})} technologies")
    print(f"- {mongo.db.skills.count_documents({})} skills")
    print(f"- {mongo.db.projects.count_documents({})} projects")
    print(f"- {mongo.db.experience.count_documents({})} work experiences")
    print(f"- {mongo.db.education.count_documents({})} education records")
    print(f"- {mongo.db.certifications.count_documents({})} certifications")
    print(f"- {mongo.db.achievements.count_documents({})} achievements")
    print(f"- {mongo.db.site_settings.count_documents({})} site settings")


if __name__ == "__main__":
    from app import app

    with app.app_context():
        init_database()

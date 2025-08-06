#!/usr/bin/env python3
"""
Database Management Script for Portfolio Website

This script provides utilities to manage the portfolio database including:
- Adding new projects, skills, and experience
- Updating existing data
- Viewing database contents
- Backing up and restoring data
"""

import sys
import json
from datetime import datetime, date
from models import db, Developer, Skill, Project, Technology, ProjectTechnology, Experience, ExperienceTechnology, Contact, SiteSettings
from app import app

def view_all_data():
    """View all data in the database"""
    print("\n=== PORTFOLIO DATABASE OVERVIEW ===\n")
    
    # Developer Info
    developer = Developer.query.first()
    if developer:
        print(f"👤 Developer: {developer.name} ({developer.title})")
        print(f"   📧 {developer.email}")
        print(f"   📍 {developer.location}")
        print(f"   💼 {developer.experience_years} years experience")
    
    # Skills
    skills = Skill.query.all()
    print(f"\n🔧 Skills ({len(skills)} total):")
    for skill in skills:
        featured = "⭐" if skill.is_featured else "  "
        print(f"   {featured} {skill.name}: {skill.level}% ({skill.category})")
    
    # Projects
    projects = Project.query.all()
    print(f"\n💼 Projects ({len(projects)} total):")
    for project in projects:
        featured = "⭐" if project.featured else "  "
        status_icon = {"completed": "✅", "in_progress": "🔄", "planned": "📅"}.get(project.status, "❓")
        print(f"   {featured} {status_icon} {project.title}")
        print(f"      📝 {project.description[:100]}...")
        print(f"      🔗 {project.github_url}")
    
    # Experience
    experiences = Experience.query.order_by(Experience.start_date.desc()).all()
    print(f"\n💼 Work Experience ({len(experiences)} total):")
    for exp in experiences:
        current = "🟢" if exp.is_current else "  "
        print(f"   {current} {exp.title} at {exp.company}")
        print(f"      📅 {exp.start_date} to {'Present' if exp.is_current else exp.end_date}")
        print(f"      📝 {exp.description[:100]}...")
    
    # Contacts
    contacts = Contact.query.all()
    unread_count = Contact.query.filter_by(is_read=False).count()
    print(f"\n📧 Contact Messages ({len(contacts)} total, {unread_count} unread)")
    
    print(f"\n📊 Database file: portfolio.db")
    print(f"🕒 Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

def add_project():
    """Add a new project to the database"""
    print("\n=== ADD NEW PROJECT ===\n")
    
    title = input("Project title: ")
    description = input("Short description: ")
    detailed_description = input("Detailed description (optional): ") or None
    github_url = input("GitHub URL: ")
    live_url = input("Live URL (optional): ") or None
    image_url = input("Image URL (optional): ") or None
    featured = input("Featured project? (y/N): ").lower().startswith('y')
    status = input("Status (completed/in_progress/planned) [completed]: ") or "completed"
    
    # Technologies
    print("\nEnter technologies (comma-separated):")
    tech_input = input("Technologies: ")
    tech_names = [t.strip() for t in tech_input.split(',') if t.strip()]
    
    # Create project
    project = Project(
        title=title,
        description=description,
        detailed_description=detailed_description,
        github_url=github_url,
        live_url=live_url,
        image_url=image_url,
        featured=featured,
        status=status
    )
    
    db.session.add(project)
    db.session.flush()  # Get project ID
    
    # Add technologies
    for tech_name in tech_names:
        tech = Technology.query.filter_by(name=tech_name).first()
        if not tech:
            tech = Technology(name=tech_name, category="other")
            db.session.add(tech)
            db.session.flush()
        
        project_tech = ProjectTechnology(
            project_id=project.id,
            technology_id=tech.id
        )
        db.session.add(project_tech)
    
    db.session.commit()
    print(f"\n✅ Project '{title}' added successfully!")

def add_skill():
    """Add a new skill to the database"""
    print("\n=== ADD NEW SKILL ===\n")
    
    name = input("Skill name: ")
    level = int(input("Skill level (0-100): "))
    category = input("Category (Frontend/Backend/Database/Tools/etc.): ")
    featured = input("Featured skill? (y/N): ").lower().startswith('y')
    
    skill = Skill(
        name=name,
        level=level,
        category=category,
        is_featured=featured
    )
    
    db.session.add(skill)
    db.session.commit()
    print(f"\n✅ Skill '{name}' added successfully!")

def add_experience():
    """Add a new work experience to the database"""
    print("\n=== ADD NEW WORK EXPERIENCE ===\n")
    
    title = input("Job title: ")
    company = input("Company name: ")
    company_url = input("Company URL (optional): ") or None
    location = input("Location (optional): ") or None
    employment_type = input("Employment type (full-time/part-time/contract): ") or "full-time"
    
    start_date_str = input("Start date (YYYY-MM-DD): ")
    start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
    
    is_current = input("Current job? (y/N): ").lower().startswith('y')
    end_date = None
    if not is_current:
        end_date_str = input("End date (YYYY-MM-DD): ")
        end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
    
    description = input("Job description: ")
    
    # Achievements
    print("\nEnter achievements (one per line, empty line to finish):")
    achievements = []
    while True:
        achievement = input("Achievement: ")
        if not achievement:
            break
        achievements.append(achievement)
    
    # Technologies
    print("\nEnter technologies used (comma-separated):")
    tech_input = input("Technologies: ")
    tech_names = [t.strip() for t in tech_input.split(',') if t.strip()]
    
    experience = Experience(
        title=title,
        company=company,
        company_url=company_url,
        location=location,
        employment_type=employment_type,
        start_date=start_date,
        end_date=end_date,
        description=description,
        achievements=json.dumps(achievements) if achievements else None,
        is_current=is_current
    )
    
    db.session.add(experience)
    db.session.flush()
    
    # Add technologies
    for tech_name in tech_names:
        tech = Technology.query.filter_by(name=tech_name).first()
        if not tech:
            tech = Technology(name=tech_name, category="other")
            db.session.add(tech)
            db.session.flush()
        
        exp_tech = ExperienceTechnology(
            experience_id=experience.id,
            technology_id=tech.id
        )
        db.session.add(exp_tech)
    
    db.session.commit()
    print(f"\n✅ Experience '{title} at {company}' added successfully!")

def update_developer_info():
    """Update developer information"""
    print("\n=== UPDATE DEVELOPER INFO ===\n")
    
    developer = Developer.query.first()
    if not developer:
        print("No developer profile found. Creating new one...")
        developer = Developer()
        db.session.add(developer)
    
    print(f"Current name: {developer.name}")
    new_name = input("New name (press Enter to keep current): ")
    if new_name:
        developer.name = new_name
    
    print(f"Current title: {developer.title}")
    new_title = input("New title (press Enter to keep current): ")
    if new_title:
        developer.title = new_title
    
    print(f"Current email: {developer.email}")
    new_email = input("New email (press Enter to keep current): ")
    if new_email:
        developer.email = new_email
    
    print(f"Current location: {developer.location}")
    new_location = input("New location (press Enter to keep current): ")
    if new_location:
        developer.location = new_location
    
    print(f"Current bio: {developer.bio}")
    new_bio = input("New bio (press Enter to keep current): ")
    if new_bio:
        developer.bio = new_bio
    
    db.session.commit()
    print("\n✅ Developer info updated successfully!")

def export_data():
    """Export all data to JSON file"""
    print("\n=== EXPORT DATA ===\n")
    
    data = {
        "developer": Developer.query.first().to_dict() if Developer.query.first() else None,
        "skills": [skill.to_dict() for skill in Skill.query.all()],
        "projects": [project.to_dict() for project in Project.query.all()],
        "experience": [exp.to_dict() for exp in Experience.query.all()],
        "contacts": [contact.to_dict() for contact in Contact.query.all()],
        "export_date": datetime.now().isoformat()
    }
    
    filename = f"portfolio_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2, default=str)
    
    print(f"✅ Data exported to {filename}")

def main():
    """Main menu"""
    with app.app_context():
        while True:
            print("\n" + "="*50)
            print("📊 PORTFOLIO DATABASE MANAGER")
            print("="*50)
            print("1. View all data")
            print("2. Add new project")
            print("3. Add new skill")
            print("4. Add work experience")
            print("5. Update developer info")
            print("6. Export data to JSON")
            print("0. Exit")
            print("-"*50)
            
            choice = input("Choose an option (0-6): ").strip()
            
            if choice == "0":
                print("\n👋 Goodbye!")
                break
            elif choice == "1":
                view_all_data()
            elif choice == "2":
                add_project()
            elif choice == "3":
                add_skill()
            elif choice == "4":
                add_experience()
            elif choice == "5":
                update_developer_info()
            elif choice == "6":
                export_data()
            else:
                print("\n❌ Invalid option. Please try again.")
            
            input("\nPress Enter to continue...")

if __name__ == "__main__":
    main()

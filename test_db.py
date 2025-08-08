#!/usr/bin/env python3
"""
Test script to connect to the PostgreSQL database and initialize it
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set the database URL for testing
os.environ['DATABASE_URL'] = 'postgresql://portfolio_user:YEY89e5JySSO4h4XXOUtBI38wE8531Xa@dpg-d2b2emfdiees73eb6380-a.oregon-postgres.render.com/portfolio_rton'

# Now import and test the app
from app import app
from models import db, Developer, Skill, Project, Experience

def test_database_connection():
    """Test database connection and initialization"""
    try:
        with app.app_context():
            print("🔌 Testing database connection...")
            
            # Test connection
            db.engine.execute('SELECT 1')
            print("✅ Database connection successful!")
            
            # Check if tables exist
            print("\n📋 Checking database tables...")
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"📊 Found {len(tables)} tables: {tables}")
            
            # Check data
            print("\n📊 Checking data...")
            developer_count = Developer.query.count()
            skill_count = Skill.query.count()
            project_count = Project.query.count()
            experience_count = Experience.query.count()
            
            print(f"👤 Developers: {developer_count}")
            print(f"🔧 Skills: {skill_count}")
            print(f"📁 Projects: {project_count}")
            print(f"💼 Experience: {experience_count}")
            
            if developer_count == 0:
                print("\n🚀 Initializing database with your portfolio data...")
                from init_db import init_database
                init_database()
                print("✅ Database initialized successfully!")
            else:
                print("✅ Database already has data!")
                
    except Exception as e:
        print(f"❌ Database error: {e}")
        return False
    
    return True

if __name__ == "__main__":
    test_database_connection()

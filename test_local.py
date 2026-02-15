#!/usr/bin/env python3
"""
Local Testing Script
Run this script to test your portfolio backend locally before deployment.
"""

import requests
import json
from datetime import datetime

def test_api_endpoints():
    """Test all API endpoints locally"""
    base_url = "http://localhost:5000"
    
    print("🧪 Testing Portfolio API Endpoints")
    print("=" * 50)
    
    # Test endpoints
    endpoints = [
        ("/api/developer", "Developer Info"),
        ("/api/skills", "Skills"),
        ("/api/projects", "Projects"),
        ("/api/technologies", "Technologies"),
        ("/api/experiences", "Work Experience"),
        ("/api/education", "Education"),
        ("/api/certifications", "Certifications"),
        ("/api/achievements", "Achievements"),
    ]
    
    for endpoint, description in endpoints:
        try:
            print(f"📍 Testing {description}: {endpoint}")
            response = requests.get(f"{base_url}{endpoint}", timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                count = len(data) if isinstance(data, list) else 1
                print(f"   ✅ Success! Retrieved {count} records")
            else:
                print(f"   ❌ Failed! Status: {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print(f"   ⚠️  Server not running. Start with: python app.py")
            break
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 50)

def test_contact_form():
    """Test contact form submission"""
    base_url = "http://localhost:5000"
    
    print("📧 Testing Contact Form")
    print("=" * 30)
    
    # Test data
    test_contact = {
        "name": "Test User",
        "email": "test@example.com",
        "subject": "Test Subject",
        "message": "This is a test message from the local testing script."
    }
    
    try:
        print("📤 Sending test contact form...")
        response = requests.post(
            f"{base_url}/api/contact",
            json=test_contact,
            timeout=10
        )
        
        if response.status_code == 200:
            print("   ✅ Contact form submitted successfully!")
            result = response.json()
            print(f"   📩 Response: {result.get('message', 'Success')}")
        else:
            print(f"   ❌ Failed! Status: {response.status_code}")
            print(f"   📄 Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("   ⚠️  Server not running. Start with: python app.py")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print()

def verify_database():
    """Verify database has data"""
    print("🗄️  Verifying Database")
    print("=" * 30)
    
    try:
        from models import mongo
        from app import app

        with app.app_context():
            collections = [
                ("developer", "Developer profiles"),
                ("skills", "Skills"),
                ("projects", "Projects"),
                ("technologies", "Technologies"),
                ("experience", "Work experiences"),
                ("education", "Education records"),
                ("certifications", "Certifications"),
                ("achievements", "Achievements"),
            ]

            total_records = 0
            for coll_name, description in collections:
                count = mongo.db[coll_name].count_documents({})
                total_records += count
                status = "✅" if count > 0 else "⚠️"
                print(f"   {status} {description}: {count}")

            if total_records > 0:
                print(f"\n   🎉 Database is ready! Total records: {total_records}")
            else:
                print(f"\n   ❌ Database is empty! Run: python setup_database.py")
                
    except Exception as e:
        print(f"   ❌ Database error: {e}")
        print(f"   💡 Try running: python setup_database.py")
    
    print()

def main():
    print("🚀 Portfolio Backend - Local Testing")
    print("=" * 50)
    print(f"⏰ Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # 1. Verify database
    verify_database()
    
    # 2. Test API endpoints
    test_api_endpoints()
    
    # 3. Test contact form
    test_contact_form()
    
    print("🏁 Testing completed!")
    print("\n💡 Next steps:")
    print("   1. If all tests pass, you're ready to deploy!")
    print("   2. Push your code to GitHub")
    print("   3. Follow the DEPLOYMENT.md guide")
    print("   4. Deploy to Render")
    print("\n🚀 Happy deploying!")

if __name__ == "__main__":
    main()

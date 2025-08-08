from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class Developer(db.Model):
    __tablename__ = 'developer'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    experience_years = db.Column(db.Integer, nullable=False)
    bio = db.Column(db.Text, nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    linkedin = db.Column(db.String(200), nullable=True)
    github = db.Column(db.String(200), nullable=True)
    resume_url = db.Column(db.String(200), nullable=True)
    profile_image = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'title': self.title,
            'experience_years': self.experience_years,
            'bio': self.bio,
            'email': self.email,
            'phone': self.phone,
            'location': self.location,
            'linkedin': self.linkedin,
            'github': self.github,
            'resume_url': self.resume_url,
            'profile_image': self.profile_image
        }

class Skill(db.Model):
    __tablename__ = 'skills'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    level = db.Column(db.Integer, nullable=False)  # 0-100
    category = db.Column(db.String(50), nullable=False)
    icon = db.Column(db.String(100), nullable=True)  # For skill icons
    order_index = db.Column(db.Integer, default=0)  # For custom ordering
    is_featured = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'level': self.level,
            'proficiency': self.level,  # Add proficiency alias for frontend compatibility
            'category': self.category,
            'icon': self.icon,
            'is_featured': self.is_featured
        }

class Project(db.Model):
    __tablename__ = 'projects'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    detailed_description = db.Column(db.Text, nullable=True)  # For project detail page
    github_url = db.Column(db.String(200), nullable=True)
    live_url = db.Column(db.String(200), nullable=True)
    image_url = db.Column(db.String(200), nullable=True)
    featured = db.Column(db.Boolean, default=False)
    status = db.Column(db.String(20), default='completed')  # completed, in_progress, planned
    start_date = db.Column(db.Date, nullable=True)
    end_date = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    technologies = db.relationship('ProjectTechnology', back_populates='project', cascade='all, delete-orphan')
    images = db.relationship('ProjectImage', back_populates='project', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'detailed_description': self.detailed_description,
            'github_url': self.github_url,
            'live_url': self.live_url,
            'image_url': self.image_url,
            'featured': self.featured,
            'status': self.status,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'created_date': self.created_at.isoformat(),
            'technologies': [tech.technology.name for tech in self.technologies if tech.technology],
            'images': [img.to_dict() for img in self.images]
        }

class Technology(db.Model):
    __tablename__ = 'technologies'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False, unique=True)
    category = db.Column(db.String(50), nullable=True)  # frontend, backend, database, etc.
    icon = db.Column(db.String(100), nullable=True)
    color = db.Column(db.String(7), nullable=True)  # Hex color for UI
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'icon': self.icon,
            'color': self.color
        }

class ProjectTechnology(db.Model):
    __tablename__ = 'project_technologies'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    technology_id = db.Column(db.Integer, db.ForeignKey('technologies.id'), nullable=False)
    
    # Relationships
    project = db.relationship('Project', back_populates='technologies')
    technology = db.relationship('Technology')

class ProjectImage(db.Model):
    __tablename__ = 'project_images'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    image_url = db.Column(db.String(200), nullable=False)
    caption = db.Column(db.String(200), nullable=True)
    is_primary = db.Column(db.Boolean, default=False)
    order_index = db.Column(db.Integer, default=0)
    
    # Relationships
    project = db.relationship('Project', back_populates='images')
    
    def to_dict(self):
        return {
            'id': self.id,
            'image_url': self.image_url,
            'caption': self.caption,
            'is_primary': self.is_primary
        }

class Experience(db.Model):
    __tablename__ = 'experience'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    company_url = db.Column(db.String(200), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    employment_type = db.Column(db.String(50), nullable=True)  # full-time, part-time, contract, etc.
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)  # NULL means current job
    description = db.Column(db.Text, nullable=False)
    achievements = db.Column(db.Text, nullable=True)  # JSON array of achievements
    is_current = db.Column(db.Boolean, default=False)
    order_index = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    technologies = db.relationship('ExperienceTechnology', back_populates='experience', cascade='all, delete-orphan')
    
    @property
    def duration(self):
        end = self.end_date if self.end_date else datetime.now().date()
        start = self.start_date
        
        years = end.year - start.year
        months = end.month - start.month
        
        if months < 0:
            years -= 1
            months += 12
            
        if years > 0 and months > 0:
            return f"{years} year{'s' if years != 1 else ''}, {months} month{'s' if months != 1 else ''}"
        elif years > 0:
            return f"{years} year{'s' if years != 1 else ''}"
        else:
            return f"{months} month{'s' if months != 1 else ''}"
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'company': self.company,
            'company_url': self.company_url,
            'location': self.location,
            'employment_type': self.employment_type,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'description': self.description,
            'achievements': json.loads(self.achievements) if self.achievements else [],
            'is_current': self.is_current,
            'duration': self.duration,
            'technologies': [tech.technology.name for tech in self.technologies if tech.technology]
        }

class ExperienceTechnology(db.Model):
    __tablename__ = 'experience_technologies'
    
    id = db.Column(db.Integer, primary_key=True)
    experience_id = db.Column(db.Integer, db.ForeignKey('experience.id'), nullable=False)
    technology_id = db.Column(db.Integer, db.ForeignKey('technologies.id'), nullable=False)
    
    # Relationships
    experience = db.relationship('Experience', back_populates='technologies')
    technology = db.relationship('Technology')

class Contact(db.Model):
    __tablename__ = 'contacts'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    is_replied = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'subject': self.subject,
            'message': self.message,
            'is_read': self.is_read,
            'is_replied': self.is_replied,
            'created_at': self.created_at.isoformat()
        }

class SiteSettings(db.Model):
    __tablename__ = 'site_settings'
    
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), nullable=False, unique=True)
    value = db.Column(db.Text, nullable=True)
    description = db.Column(db.String(200), nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'key': self.key,
            'value': self.value,
            'description': self.description
        }

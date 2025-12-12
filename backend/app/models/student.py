from sqlalchemy import Column, Integer, String, Boolean, Text, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Student(Base):
    __tablename__ = "student"
    
    student_id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password = Column(String(255), nullable=False)
    
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    
    status = Column(String(20), default='pending', index=True)
    is_email_verified = Column(Boolean, default=False)
    
    document_url = Column(String(500), nullable=False)
    
    phone = Column(String(20), nullable=True)
    cv_url = Column(String(500), nullable=True)
    cv_visibility = Column(Boolean, default=False)
    
    bio = Column(Text, nullable=True)
    portfolio_url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    profile_pic = Column(String(500), nullable=True)
    
    establishment_id = Column(Integer, ForeignKey('establishment.establishment_id', ondelete='SET NULL'), nullable=True)
    speciality_id = Column(Integer, ForeignKey('speciality.speciality_id', ondelete='SET NULL'), nullable=True)
    
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
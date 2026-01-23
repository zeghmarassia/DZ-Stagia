from sqlalchemy import Column, Integer, String, Text, DECIMAL, Boolean, Date, TIMESTAMP, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import date
from app.database import Base

class Offer(Base):
    __tablename__ = "offer"
    
    offer_id = Column(Integer, primary_key=True, autoincrement=True)
    company_id = Column(Integer, ForeignKey('company.company_id', ondelete='CASCADE'), nullable=False, index=True)
    
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    
    offer_type = Column(String(50), nullable=False)
    duration = Column(String(50), nullable=True)
    
    salary_min = Column(DECIMAL(10, 2), nullable=True)
    salary_max = Column(DECIMAL(10, 2), nullable=True)
    
    location_mode = Column(String(50), nullable=True)
    location = Column(String(255), nullable=True)
    employment_type = Column(String(50), nullable=True)
    
    visibility = Column(Boolean, default=True, index=True)
    is_active = Column(Boolean, default=True)
    
    expiration_date = Column(Date, nullable=True, index=True)
    
    views_count = Column(Integer, default=0)
    applications_count = Column(Integer, default=0)
    
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    company = relationship("Company", back_populates="offers")
    applications = relationship("Application", back_populates="offer", cascade="all, delete-orphan")
    targeted_establishments = relationship("Establishment", secondary="offer_establishment", back_populates="targeted_offers")
    required_skills = relationship("Skill", secondary="offer_skill", back_populates="offers")
    required_specialities = relationship("Speciality", secondary="offer_speciality", back_populates="offers")
    
    # Table constraints
    __table_args__ = (
        CheckConstraint('salary_min <= salary_max', name='check_salary_range'),
        CheckConstraint("offer_type IN ('stage', 'pfe', 'emploi')", name='check_offer_type'),
    )
    
    def is_expired(self):
        """Check if the offer has passed its expiration date"""
        if self.expiration_date:
            return date.today() > self.expiration_date
        return False
    
    def is_visible_to_student(self, student):
        """Check if this offer should be visible to a specific student"""
        if not self.is_active or not self.visibility:
            return False
        
        if self.is_expired():
            return False
        
        # If no establishments are targeted--> offer is visible to all
        if not self.targeted_establishments:
            return True
        
        # Check if student's establishment is in the targeted list
        return student.establishment_id in [est.establishment_id for est in self.targeted_establishments]
    
    def increment_views(self):
        """Increment the views counter"""
        self.views_count += 1
    
    def increment_applications(self):
        """Increment the applications counter"""
        self.applications_count += 1

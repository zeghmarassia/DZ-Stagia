from sqlalchemy import Column, Integer, String, Text, DECIMAL, Boolean, Date, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
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
    
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
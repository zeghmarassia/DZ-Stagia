from sqlalchemy import Column, Integer, String, Boolean, Text, TIMESTAMP
from sqlalchemy.sql import func
from app.database import Base

class Company(Base):
    __tablename__ = "company"
    
    company_id = Column(Integer, primary_key=True, autoincrement=True)
    
    email = Column(String(255), nullable=False, unique=True, index=True)
    password = Column(String(255), nullable=False)
    company_name = Column(String(200), nullable=False)
    
    status = Column(String(20), default='pending', index=True)
    is_email_verified = Column(Boolean, default=False)
    
    document_url = Column(String(500), nullable=False)
    
    description = Column(Text, nullable=True)
    sector = Column(String(100), nullable=True)
    
    logo_url = Column(String(500), nullable=True)
    address = Column(String(255), nullable=True)
    contact = Column(String(20), nullable=True)
    website = Column(String(255), nullable=True)
    
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
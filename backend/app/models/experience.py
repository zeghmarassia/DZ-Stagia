from sqlalchemy import Column, Integer, String, Text, Date, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Experience(Base):
    __tablename__ = "experience"
    
    experience_id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey('student.student_id', ondelete='CASCADE'), nullable=False)
    
    title = Column(String(100), nullable=False)
    company = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    is_current = Column(Boolean, default=False)
    
    created_at = Column(TIMESTAMP, server_default=func.now())
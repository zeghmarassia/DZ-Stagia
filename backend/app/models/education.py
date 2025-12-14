from sqlalchemy import Column, Integer, String, Date, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Education(Base):
    __tablename__ = "education"
    
    education_id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey('student.student_id', ondelete='CASCADE'), nullable=False)
    
    degree = Column(String(100), nullable=False)
    institution = Column(String(200), nullable=False)
    field_of_study = Column(String(100), nullable=True)
    
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    is_current = Column(Boolean, default=False)
    
    created_at = Column(TIMESTAMP, server_default=func.now())
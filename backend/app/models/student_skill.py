from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class StudentSkill(Base):
    __tablename__ = "student_skill"
    
    student_id = Column(Integer, ForeignKey('student.student_id', ondelete='CASCADE'), primary_key=True)
    skill_id = Column(Integer, ForeignKey('skill.skill_id', ondelete='CASCADE'), primary_key=True)
    
    proficiency_level = Column(String(50), nullable=True)
    
    created_at = Column(TIMESTAMP, server_default=func.now())
from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from app.database import Base

class Application(Base):
    __tablename__ = "application"
    
    application_id = Column(Integer, primary_key=True, autoincrement=True)
    offer_id = Column(Integer, ForeignKey('offer.offer_id', ondelete='CASCADE'), nullable=False, index=True)
    student_id = Column(Integer, ForeignKey('student.student_id', ondelete='CASCADE'), nullable=False, index=True)
    
    status = Column(String(50), default='received', index=True)  # 'received', 'under_review', 'interview_scheduled', 'accepted', 'rejected'
    
    applied_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    
    __table_args__ = (
        UniqueConstraint('offer_id', 'student_id', name='unique_offer_student'),
    )
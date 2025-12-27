from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Notification(Base):
    __tablename__ = "notification"
    
    notification_id = Column(Integer, primary_key=True, autoincrement=True)
    
    student_id = Column(Integer, ForeignKey('student.student_id', ondelete='CASCADE'), nullable=True, index=True)
    company_id = Column(Integer, ForeignKey('company.company_id', ondelete='CASCADE'), nullable=True, index=True)
    
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=True)
    type = Column(String(50), nullable=False)
    
    related_offer_id = Column(Integer, ForeignKey('offer.offer_id', ondelete='SET NULL'), nullable=True)
    related_application_id = Column(Integer, ForeignKey('application.application_id', ondelete='SET NULL'), nullable=True)
    
    created_at = Column(TIMESTAMP, server_default=func.now())
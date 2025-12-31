from sqlalchemy import CheckConstraint, Column, Integer, String, TIMESTAMP, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship 
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
    student = relationship("Student", back_populates="applications")
    offer = relationship("Offer", back_populates="applications")
    
    __table_args__ = (
        UniqueConstraint('offer_id', 'student_id', name='unique_offer_student'),
    CheckConstraint(
            "status IN ('received', 'in_review', 'interview_scheduled', 'accepted', 'rejected')",
            name='check_application_status'),
    )
    def can_be_modified_by_student(self) -> bool:
        """Check if student can still cancel this application"""
        return self.status in ['received', 'in_review']
    
    def can_change_status_to(self, new_status: str) -> bool:
        """Validate status transitions"""
        valid_transitions = {
            'received': ['in_review', 'rejected'],
            'in_review': ['interview_scheduled', 'accepted', 'rejected'],
            'interview_scheduled': ['accepted', 'rejected'],
            'accepted': [],
            'rejected': []
        }
        return new_status in valid_transitions.get(self.status, [])
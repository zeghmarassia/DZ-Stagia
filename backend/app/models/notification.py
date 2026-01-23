from sqlalchemy import Column, Integer, String, Text, Boolean, TIMESTAMP, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Notification(Base):
    __tablename__ = "notification"
    
    notification_id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Recipients (one of them will be filled)
    student_id = Column(Integer, ForeignKey('student.student_id', ondelete='CASCADE'), nullable=True, index=True)
    company_id = Column(Integer, ForeignKey('company.company_id', ondelete='CASCADE'), nullable=True, index=True)
    
    # Notification details
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), nullable=False, index=True)
    
    # Related entities
    related_offer_id = Column(Integer, ForeignKey('offer.offer_id', ondelete='SET NULL'), nullable=True)
    related_application_id = Column(Integer, ForeignKey('application.application_id', ondelete='SET NULL'), nullable=True)
    
    # AJOUTER: Status de lecture
    is_read = Column(Boolean, default=False, index=True)
    read_at = Column(TIMESTAMP, nullable=True)
    
    # Timestamps
    created_at = Column(TIMESTAMP, server_default=func.now(), index=True)
    
    # AJOUTER: Relationships (optionnels mais utiles)
    student = relationship("Student", foreign_keys=[student_id])
    company = relationship("Company", foreign_keys=[company_id])
    offer = relationship("Offer", foreign_keys=[related_offer_id])
    application = relationship("Application", foreign_keys=[related_application_id])
    
    # AJOUTER: Contrainte pour valider les types
    __table_args__ = (
        CheckConstraint(
            "type IN ('account_approved', 'account_rejected', 'new_application', 'application_status_changed', 'new_offer_match')",
            name='check_notification_type'
        ),
    )
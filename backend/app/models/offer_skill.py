from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.database import Base

class OfferSkill(Base):
    __tablename__ = "offer_skill"
    
    offer_id = Column(Integer, ForeignKey('offer.offer_id', ondelete='CASCADE'), primary_key=True)
    skill_id = Column(Integer, ForeignKey('skill.skill_id', ondelete='CASCADE'), primary_key=True)
    
    required_level = Column(String(50), nullable=True)
    is_required = Column(Boolean, default=True)
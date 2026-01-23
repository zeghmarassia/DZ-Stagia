from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Speciality(Base):
    __tablename__ = "speciality"
    
    speciality_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    domain_id = Column(Integer, ForeignKey('domain.domain_id', ondelete='CASCADE'), nullable=False)
    offers = relationship("Offer", secondary="offer_speciality", back_populates="required_specialities")
    applications = relationship("Application", back_populates="student", cascade="all, delete-orphan")

from sqlalchemy import Column, Integer, ForeignKey
from app.database import Base

class OfferEstablishment(Base):
    __tablename__ = "offer_establishment"
    
    offer_id = Column(Integer, ForeignKey('offer.offer_id', ondelete='CASCADE'), primary_key=True)
    establishment_id = Column(Integer, ForeignKey('establishment.establishment_id', ondelete='CASCADE'), primary_key=True)
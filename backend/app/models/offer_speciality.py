from sqlalchemy import Column, Integer, ForeignKey, Table
from app.database import Base

offer_speciality = Table(
    'offer_speciality',
    Base.metadata,
    Column('offer_id', Integer, ForeignKey('offer.offer_id', ondelete='CASCADE'), primary_key=True),
    Column('speciality_id', Integer, ForeignKey('speciality.speciality_id', ondelete='CASCADE'), primary_key=True)
)
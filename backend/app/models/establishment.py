from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.sql import func
from app.database import Base

class Establishment(Base):
    __tablename__ = "establishment"
    
    establishment_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    abbreviation = Column(String(20), nullable=True)
    type = Column(String(50), nullable=True)
    address = Column(String(255), nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
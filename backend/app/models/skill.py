from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class Skill(Base):
    __tablename__ = "skill"
    
    skill_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)
    category = Column(String(50), nullable=True)
    offers = relationship("Offer", secondary="offer_skill", back_populates="required_skills")
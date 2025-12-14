from sqlalchemy import Column, Integer, String
from app.database import Base

class Skill(Base):
    __tablename__ = "skill"
    
    skill_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)
    category = Column(String(50), nullable=True)
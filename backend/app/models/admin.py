from sqlalchemy import Column, Integer, String, TIMESTAMP
from sqlalchemy.sql import func
from app.database import Base

class Admin(Base):
    __tablename__ = "admin"
    
    admin_id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password = Column(String(255), nullable=False)
    
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    
    picture = Column(String(500), nullable=True)
    
    created_at = Column(TIMESTAMP, server_default=func.now())
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP
from sqlalchemy.sql import func
from app.database import Base

class OTP(Base):
    __tablename__ = "otp"
    
    otp_id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), nullable=False, index=True)
    otp_code = Column(String(6), nullable=False)
    user_type = Column(String(20), nullable=False, index=True)  # 'student', 'company', 'admin'
    purpose = Column(String(20), nullable=False, index=True)
    expires_at = Column(TIMESTAMP, nullable=False, index=True)
    is_used = Column(Boolean, default=False, index=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
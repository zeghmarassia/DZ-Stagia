from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: str | None = None
    user_type: str | None = None

# the same for admin, student, and company
class LoginRequest(BaseModel):
    """Unified login for all user types (student, company, admin)"""
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_type: str
    user: dict


class StudentRegister(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    document_url: str
    establishment_id: int

class StudentResponse(BaseModel):
    student_id: int
    email: str
    first_name: str
    last_name: str
    status: str
    is_email_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class CompanyRegister(BaseModel):
    email: EmailStr
    password: str
    company_name: str
    document_url: str
    sector: str
    address: str

class CompanyResponse(BaseModel):
    company_id: int
    email: str
    company_name: str
    status: str
    is_email_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class AdminResponse(BaseModel):
    admin_id: int
    email: str
    first_name: str
    last_name: str
    created_at: datetime
    
    class Config:
        from_attributes = True



class OTPRequest(BaseModel):
    """Request OTP for password reset"""
    email: EmailStr

class OTPVerify(BaseModel):
    """Verify OTP and reset password"""
    otp_code: str
    new_password: str
    
class OTPVerifyWithEmail(BaseModel):
    """Alternative: Include email if frontend doesn't store it"""
    email: EmailStr
    otp_code: str
    new_password: str
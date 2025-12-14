from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from typing import Optional, Tuple
import random
import string
from datetime import datetime, timedelta

from app.models import Student, Company, Admin
from app.schemas.auth import (
    StudentRegister, CompanyRegister, StudentResponse, CompanyResponse, AdminResponse,
    Token, OTPRequest, OTPVerify, LoginResponse
)
from app.utils.security import get_password_hash, verify_password, create_access_token

# In-memory OTP storage (use Redis in production)
otp_storage = {}

class AuthService:
    
    @staticmethod
    def generate_otp() -> str:
        return ''.join(random.choices(string.digits, k=6))
    
    @staticmethod
    def store_otp(email: str, otp: str, expires_minutes: int = 10):
        expiry = datetime.utcnow() + timedelta(minutes=expires_minutes)
        otp_storage[email] = {
            "code": otp,
            "expires_at": expiry
        }
    
    @staticmethod
    def verify_otp(email: str, otp: str) -> bool:
        stored = otp_storage.get(email)
        if not stored:
            return False
        
        if datetime.utcnow() > stored["expires_at"]:
            del otp_storage[email]
            return False
        
        if stored["code"] == otp:
            del otp_storage[email]
            return True
        
        return False

#this is used when we dont have a token yet to ge the user info
    @staticmethod
    def detect_user_type(db: Session, email: str) -> Tuple[Optional[str], Optional[any]]:
        # Check student
        student = db.query(Student).filter(Student.email == email).first()
        if student:
            return ("student", student)
        
        # Check company
        company = db.query(Company).filter(Company.email == email).first()
        if company:
            return ("company", company)
        
        # Check admin
        admin = db.query(Admin).filter(Admin.email == email).first()
        if admin:
            return ("admin", admin)
        
        return (None, None)
    

    
    @staticmethod
    def login(db: Session, email: str, password: str) -> LoginResponse:

        # Detect user type
        user_type, user = AuthService.detect_user_type(db, email)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Verify password
        if not verify_password(password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Different validation based on user type
        if user_type in ["student", "company"]:
            # Check email verification
            if not user.is_email_verified:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Please verify your email first"
                )
            
            # Check account status (students and companies need approval)
            if user.status != 'approved':
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Your account is {user.status}. Please wait for admin approval."
                )
        
        # Create access token with user info
        user_id_field = f"{user_type}_id"
        access_token = create_access_token(
            data={
                "sub": email,
                "user_type": user_type,
                "user_id": getattr(user, user_id_field)
            }
        )
        
        if user_type == "student":
            user_data = StudentResponse.from_orm(user).dict()
        elif user_type == "company":
            user_data = CompanyResponse.from_orm(user).dict()
        else:  # admin
            user_data = AdminResponse.from_orm(user).dict()
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_type": user_type,
            "user": user_data
        }
    
    
    @staticmethod
    def register_student(db: Session, student_data: StudentRegister) -> Student:
        
        # Check if email already exists (across all user types)
        user_type, _ = AuthService.detect_user_type(db, student_data.email)
        if user_type:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Email already registered as {user_type}"
            )
        
        # Hash password
        hashed_password = get_password_hash(student_data.password)
        
        # Create student
        new_student = Student(
            email=student_data.email,
            password=hashed_password,
            first_name=student_data.first_name,
            last_name=student_data.last_name,
            document_url=student_data.document_url,
            establishment_id=student_data.establishment_id,
            status='pending',
            is_email_verified=False
        )
        
        try:
            db.add(new_student)
            db.commit()
            db.refresh(new_student)
            return new_student
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration failed. Please check your data."
            )
    
    
    @staticmethod
    def register_company(db: Session, company_data: CompanyRegister) -> Company:
        
        # Check if email already exists (across all user types)
        user_type, _ = AuthService.detect_user_type(db, company_data.email)
        if user_type:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Email already registered as {user_type}"
            )
        
        # Hash password
        hashed_password = get_password_hash(company_data.password)
        
        # Create company
        new_company = Company(
            email=company_data.email,
            password=hashed_password,
            company_name=company_data.company_name,
            document_url=company_data.document_url,
            sector=company_data.sector,
            address=company_data.address,
            status='pending',
            is_email_verified=False
        )
        
        try:
            db.add(new_company)
            db.commit()
            db.refresh(new_company)
            return new_company
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration failed. Please check your data."
            )
    
    
    @staticmethod
    def request_password_reset(db: Session, otp_request: OTPRequest) -> str:
        
        # Check if user exists
        user_type, user = AuthService.detect_user_type(db, otp_request.email)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Generate and store OTP
        otp = AuthService.generate_otp()
        AuthService.store_otp(otp_request.email, otp)
        
        # TODO: Send email with OTP
        # For now, return OTP (REMOVE IN PRODUCTION!)
        print(f"OTP for {otp_request.email} ({user_type}): {otp}")
        
        return otp  # In production, don't return this!
    
    @staticmethod
    def reset_password(db: Session, otp_verify: OTPVerify) -> dict:
        """Reset password with OTP - works for all user types"""
        
        # Verify OTP
        if not AuthService.verify_otp(otp_verify.email, otp_verify.otp_code):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired OTP"
            )
        
        # Find user
        user_type, user = AuthService.detect_user_type(db, otp_verify.email)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Update password
        user.password = get_password_hash(otp_verify.new_password)
        db.commit()
        
        return {"message": "Password reset successfully"}
    
    
    @staticmethod
    def logout() -> dict:
        return {"message": "Logged out successfully"}
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status, UploadFile
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
from app.utils.storage import upload_student_document, upload_company_document

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

    @staticmethod
    def detect_user_type(db: Session, email: str) -> Tuple[Optional[str], Optional[any]]:
        """Detect user type by email across all user tables"""
        student = db.query(Student).filter(Student.email == email).first()
        if student:
            return ("student", student)
        
        company = db.query(Company).filter(Company.email == email).first()
        if company:
            return ("company", company)
        
        admin = db.query(Admin).filter(Admin.email == email).first()
        if admin:
            return ("admin", admin)
        
        return (None, None)
    
    @staticmethod
    def login(db: Session, email: str, password: str) -> LoginResponse:
        """Login for all user types (student, company, admin)"""
        
        user_type, user = AuthService.detect_user_type(db, email)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        if not verify_password(password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Validation for students and companies
        if user_type in ["student", "company"]:
            if not user.is_email_verified:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Please verify your email first"
                )
            
            if user.status != 'approved':
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Your account is {user.status}. Please wait for admin approval."
                )
        
        # Create token with consistent payload
        user_id_field = f"{user_type}_id"
        access_token = create_access_token(
            data={
                "sub": email,  # Standard JWT "subject" field
                "user_type": user_type,
                "user_id": getattr(user, user_id_field)
            }
        )
        
        # Format user data based on type
        if user_type == "student":
            user_data = StudentResponse.from_orm(user).dict()
        elif user_type == "company":
            user_data = CompanyResponse.from_orm(user).dict()
        else:
            user_data = AdminResponse.from_orm(user).dict()
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_type": user_type,
            "user": user_data
        }
    
    @staticmethod
    async def register_student(
        db: Session,
        email: str,
        password: str,
        first_name: str,
        last_name: str,
        establishment_id: int,
        document: UploadFile
    ) -> Student:
        """Register a new student with document upload"""
        
        # Check if email exists
        user_type, _ = AuthService.detect_user_type(db, email)
        if user_type:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Email already registered as {user_type}"
            )
        
        # Hash password
        hashed_password = get_password_hash(password)
        
        # ✅ UPLOAD DOCUMENT FIRST (before creating student)
        try:
            # Generate temporary ID for file naming
            import time
            temp_id = int(time.time() * 1000)  # Use timestamp as temp ID
            document_url = await upload_student_document(document, temp_id)
        except Exception as upload_error:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Document upload failed: {str(upload_error)}"
            )
        
        # Create student WITH document_url
        new_student = Student(
            email=email,
            password=hashed_password,
            first_name=first_name,
            last_name=last_name,
            establishment_id=establishment_id,
            status='pending',
            is_email_verified=True,
            document_url=document_url 
        )
        
        try:
            db.add(new_student)
            db.commit()
            db.refresh(new_student)
            otp = AuthService.generate_otp()
            AuthService.store_otp(email, otp)
            print(f"📧 (TESTING) Email verification OTP for {email}: {otp}")
            return new_student
            
        except IntegrityError as e:
            db.rollback()
            # Document is already uploaded but student failed
            print(f"IntegrityError after document upload: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Registration failed after document upload: {str(e)}"
            )
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Registration failed: {str(e)}"
            )

    @staticmethod
    async def register_company(
        db: Session,
        email: str,
        password: str,
        company_name: str,
        sector: str,
        address: str,
        document: UploadFile
    ) -> Company:
        """Register a new company with document upload"""
        
        # Check if email exists
        user_type, _ = AuthService.detect_user_type(db, email)
        if user_type:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Email already registered as {user_type}"
            )
        
        # Hash password
        hashed_password = get_password_hash(password)
        
        # ✅ UPLOAD DOCUMENT FIRST
        try:
            import time
            temp_id = int(time.time() * 1000)
            document_url = await upload_company_document(document, temp_id)
        except Exception as upload_error:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Document upload failed: {str(upload_error)}"
            )
        
        # Create company WITH document_url
        new_company = Company(
            email=email,
            password=hashed_password,
            company_name=company_name,
            sector=sector,
            address=address,
            status='pending',
            is_email_verified=True,
            document_url=document_url  # ✅ Already has value
        )
        
        try:
            db.add(new_company)
            db.commit()
            db.refresh(new_company)
            otp = AuthService.generate_otp()
            AuthService.store_otp(email, otp)
            print(f"(TESTING) Email verification OTP for {email}: {otp}")
            return new_company
            
        except IntegrityError as e:
            db.rollback()
            print(f"IntegrityError after document upload: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Registration failed after document upload: {str(e)}"
            )
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Registration failed: {str(e)}"
            )
        
    @staticmethod
    def verify_email(db: Session, email: str, otp: str) -> dict:
        """Verify email with OTP"""
        
        if not AuthService.verify_otp(email, otp):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired OTP"
            )
        
        user_type, user = AuthService.detect_user_type(db, email)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        user.is_email_verified = True
        db.commit()
        
        return {"message": "Email verified successfully"}
    
    @staticmethod
    def request_password_reset(db: Session, email: str) -> str:
        """Send OTP for password reset"""
        
        user_type, user = AuthService.detect_user_type(db, email)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        otp = AuthService.generate_otp()
        AuthService.store_otp(email, otp)
        
        # TODO: Send email with OTP
        print(f"🔐 OTP for {email} ({user_type}): {otp}")
        
        return otp  # Remove in production!
    
    @staticmethod
    def reset_password(db: Session, email: str, otp: str, new_password: str) -> dict:
        """Reset password with OTP"""
        
        if not AuthService.verify_otp(email, otp):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired OTP"
            )
        
        user_type, user = AuthService.detect_user_type(db, email)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        user.password = get_password_hash(new_password)
        db.commit()
        
        return {"message": "Password reset successfully"}
    
    @staticmethod
    def logout() -> dict:
        """Logout (with JWT, this is client-side token removal)"""
        return {"message": "Logged out successfully"}
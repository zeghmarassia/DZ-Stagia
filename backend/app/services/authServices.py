from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status, UploadFile, Response
from typing import Optional, Tuple
import random
import string
from datetime import datetime, timedelta

from app.models import Student, Company, Admin, Establishment, OTP
from app.schemas.auth import (
    StudentRegister, CompanyRegister, StudentResponse, CompanyResponse, AdminResponse,
    Token, OTPRequest, OTPVerify, LoginResponse
)
from app.utils.security import get_password_hash, verify_password, create_access_token
from app.utils.storage import upload_student_document, upload_company_document


class AuthService:
    
    @staticmethod
    def generate_otp() -> str:
        return ''.join(random.choices(string.digits, k=6))
    
    @staticmethod
    def store_otp(db: Session, email: str, otp: str, user_type: str, purpose: str, expires_minutes: int = 10):
        # Invalidate previous unused OTPs for this purpose
        db.query(OTP).filter(
            OTP.email == email,
            OTP.user_type == user_type,
            OTP.purpose == purpose,
            OTP.is_used == False
        ).update({"is_used": True})
        db.commit()
        
        # Create new OTP
        expiry = datetime.utcnow() + timedelta(minutes=expires_minutes)
        new_otp = OTP(
            email=email,
            otp_code=otp,
            user_type=user_type,
            purpose=purpose,
            expires_at=expiry
        )
        db.add(new_otp)
        db.commit()
    
    @staticmethod
    def verify_otp(db: Session, email: str, otp: str, user_type: str, purpose: str) -> bool:
        stored_otp = db.query(OTP).filter(
            OTP.email == email,
            OTP.otp_code == otp,
            OTP.user_type == user_type,
            OTP.purpose == purpose,
            OTP.is_used == False,
            OTP.expires_at > datetime.utcnow()
        ).first()
        
        if not stored_otp:
            return False
        
        # can choose to mark as used while keeping in the db or delete the OTP
        #stored_otp.is_used = True
        db.delete(stored_otp)
        db.commit()
        return True

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
    def login(db: Session, email: str, password: str, response: Optional[Response] = None) -> LoginResponse:
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
        
        # Create token (includes user_id)
        user_id_field = f"{user_type}_id"
        access_token = create_access_token(
            data={
                "sub": email,  
                "user_type": user_type,
                "user_id": getattr(user, user_id_field)
            }
        )

        if response is not None:
            try:
                response.set_cookie(
                    key="auth_token",
                    value=access_token,
                    httponly=True,
                    secure=False,
                    samesite="lax",
                    max_age=1440 * 60,
                    path="/",
                )
            except Exception:
                # don't break login flow if cookie cannot be set
                pass
            
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
        
        establishment = db.query(Establishment).filter(
        Establishment.establishment_id == establishment_id
        ).first()
        
        if not establishment:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid establishment ID: {establishment_id}"
            )
        # Hash password
        hashed_password = get_password_hash(password)
        
        # UPLOAD DOCUMENT FIRST (before creating student)
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
            is_email_verified=False,
            document_url=document_url 
        )
        
        try:
            db.add(new_student)
            db.flush()  # Flush to get the student_id
            db.commit()
            
            # Verify student was saved
            saved_student = db.query(Student).filter(Student.email == email).first()
            if not saved_student:
                print(f"ERROR: Student {email} not found after commit!")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Student registration failed - user not persisted"
                )
            
            print(f"SUCCESS: Student {email} registered with ID {saved_student.student_id}")

            # Generate OTP
            otp = AuthService.generate_otp()
            AuthService.store_otp(db, email, otp, "student", "verification")
            print(f"Email verification OTP for {email}: {otp}")
            
            # send the email
            try:
                from app.services.emailService import EmailService
                #await EmailService.send_welcome_email(email, f"{first_name} {last_name}", "student")
                await EmailService.send_otp_email(email, otp, "verification")
                print(f"Email with OTP sent to {email}")
            except Exception as email_error:
                print(f"Email service failed: {email_error}")
                
            return saved_student
        except HTTPException:
            raise
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
            print(f"Unexpected error during registration: {e}")
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
        
        # Check if email exists
        user_type, _ = AuthService.detect_user_type(db, email)
        if user_type:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Email already registered as {user_type}"
            )
        
        # Hash password
        hashed_password = get_password_hash(password)
        
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
            is_email_verified=False,
            document_url=document_url 
        )
        
        try:
            db.add(new_company)
            db.flush()  # Flush to get the company_id
            db.commit()
            
            # Verify company was saved
            saved_company = db.query(Company).filter(Company.email == email).first()
            if not saved_company:
                print(f"ERROR: Company {email} not found after commit!")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Company registration failed - user not persisted"
                )
            
            print(f"SUCCESS: Company {email} registered with ID {saved_company.company_id}")
            
            # Generate OTP
            otp = AuthService.generate_otp()
            AuthService.store_otp(db, email, otp, "company", "verification")
            print(f"Email verification OTP for {email}: {otp}")
            
            
            try:
                from app.services.emailService import EmailService
                #await EmailService.send_welcome_email(email, company_name, "company")
                await EmailService.send_otp_email(email, otp, "verification")
                print(f"Email with OTP sent to {email}")
            except Exception as email_error:
                # Fallback: Show OTP in console if email fails
                print(f"Email service failed: {email_error}")
            
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
        """Verify email with OTP - user must exist in database"""
        
        # First, try to find the user by email
        student = db.query(Student).filter(Student.email == email).first()
        company = db.query(Company).filter(Company.email == email).first()
        
        if not student and not company:
            print(f"DEBUG: User not found for email: {email}")
            print(f"DEBUG: Checking students table...")
            all_students = db.query(Student).all()
            print(f"DEBUG: Total students in DB: {len(all_students)}")
            for s in all_students:
                print(f"  - {s.email}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found. Please register first."
            )
        
        user = student if student else company
        user_type = "student" if student else "company"
        
        if user.is_email_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already verified"
            )
        
        if not AuthService.verify_otp(db, email, otp, user_type, "verification"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired OTP"
            )
        
        user.is_email_verified = True
        db.commit()
        
        return {"message": "Email verified successfully"}
    
    @staticmethod
    async def request_password_reset(db: Session, email: str) -> str:
        
        user_type, user = AuthService.detect_user_type(db, email)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        otp = AuthService.generate_otp()
        AuthService.store_otp(db, email, otp, user_type, "password_reset")
        
        print(f"OTP for {email} ({user_type}): {otp}")
        
        # Send email with OTP
        try:
            from app.services.emailService import EmailService
            await EmailService.send_otp_email(email, otp, "password_reset")
            print(f"Password reset OTP email sent to {email}")
        except Exception as email_error:
            print(f"Email service failed: {email_error}")
            # Don't fail the request if email fails, OTP is still generated
        
        return otp 
    
    @staticmethod
    def reset_password(db: Session, email: str, otp: str, new_password: str) -> dict:
        
        user_type, user = AuthService.detect_user_type(db, email)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        if not AuthService.verify_otp(db, email, otp, user_type, "password_reset"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired OTP"
            )
        
        user.password = get_password_hash(new_password)
        db.commit()
        
        return {"message": "Password reset successfully"}
    
    @staticmethod
    def change_password(
        db: Session,
        user_id: int,
        user_type: str,
        current_password: str,
        new_password: str
    ) -> dict:
        """for logged-in users"""
        
        # Get user based on type
        if user_type == "student":
            user = db.query(Student).filter(Student.student_id == user_id).first()
        elif user_type == "company":
            user = db.query(Company).filter(Company.company_id == user_id).first()
        elif user_type == "admin":
            user = db.query(Admin).filter(Admin.admin_id == user_id).first()
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user type"
            )
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Verify current password
        if not verify_password(current_password, user.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect"
            )
        
        # Check if new password is different
        if verify_password(new_password, user.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="New password must be different from current password"
            )
        
        # Update password
        user.password = get_password_hash(new_password)
        db.commit()
        
        return {"message": "Password changed successfully"}
    
    @staticmethod
    def logout(response: Response) -> dict:
        try:
            response.delete_cookie(
                key="auth_token",
                path="/"
            )
        except Exception as e:
            # Cookie deletion failed, but still return success
            print(f"Cookie deletion failed: {e}")
        
        return {"message": "Logged out successfully"}
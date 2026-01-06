from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Response
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth import (
    LoginRequest,
    StudentResponse, CompanyResponse,
    OTPRequest, OTPVerify
)
from app.services import AuthService

router = APIRouter(tags=["Authentication"])

@router.post("/login")
def login(
    response: Response,
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    """Login for students and companies"""
    result = AuthService.login(db, email, password, response=response)
    return result


@router.post("/admin/login")
def admin_login(
    response: Response, 
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    """Login specifically for admins"""
    result = AuthService.login(db, email, password, response=response)
    if result.get("user_type") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Admin credentials required on this endpoint"
        )
    return result


@router.post("/student/register", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
async def register_student(
    email: str = Form(...),
    password: str = Form(...),
    first_name: str = Form(...),
    last_name: str = Form(...),
    establishment_id: int = Form(...),
    document: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Register a new student account"""
    student = await AuthService.register_student(
        db=db,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        establishment_id=establishment_id,
        document=document
    )
    return student


@router.post("/company/register", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
async def register_company(
    email: str = Form(...),
    password: str = Form(...),
    company_name: str = Form(...),
    sector: str = Form(...),
    address: str = Form(...),
    document: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Register a new company account"""
    company = await AuthService.register_company(
        db=db,
        email=email,
        password=password,
        company_name=company_name,
        sector=sector,
        address=address,
        document=document
    )
    return company

@router.post("/verify-email")
async def verify_email(
    email: str = Form(...),
    otp_code: str = Form(...),
    db: Session = Depends(get_db)
):
    """Verify email with OTP"""
    if not AuthService.verify_otp(email, otp_code):
        raise HTTPException(400, "Invalid or expired OTP")
    
    user_type, user = AuthService.detect_user_type(db, email)
    
    if not user:
        raise HTTPException(404, "User not found")
    
    user.is_email_verified = True
    db.commit()
    
    return {"message": "Email verified successfully"}

@router.post("/forgot-password")
def forgot_password(
    otp_request: OTPRequest,
    db: Session = Depends(get_db)
):
    """Request password reset OTP"""
    otp = AuthService.request_password_reset(db, otp_request.email)
    return {
        "message": "OTP sent to your email",
        "otp": otp  # TODO: Remove in production!
    }


@router.post("/reset-password")
def reset_password(
    otp_verify: OTPVerify,
    db: Session = Depends(get_db)
):
    """Reset password using OTP"""
    result = AuthService.reset_password(
        db=db,
        email=otp_verify.email,
        otp_code=otp_verify.otp_code,
        new_password=otp_verify.new_password
    )
    return result


@router.post("/logout")
def logout(response: Response):
    """Logout and clear auth cookie"""
    return AuthService.logout(response)  


@router.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "authentication",
        "endpoints": {
            "login": "/login",
            "admin_login": "/admin/login",
            "register_student": "/student/register",
            "register_company": "/company/register",
            "verify_email": "/verify-email",
            "forgot_password": "/forgot-password",
            "reset_password": "/reset-password",
            "logout": "/logout"
        }
    }
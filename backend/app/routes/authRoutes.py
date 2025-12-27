from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Response
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth import (
    LoginRequest,
    StudentResponse, CompanyResponse,
    OTPRequest, OTPVerify, ChangePasswordRequest, MessageResponse,
    ForgotPasswordResponse
)
from app.services import AuthService
from app.utils.security import get_user

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
def verify_email(
    email: str = Form(...),
    otp_code: str = Form(...),
    db: Session = Depends(get_db)
):
    """Verify email with OTP"""
    return AuthService.verify_email(db, email, otp_code)

@router.post("/forgot-password", response_model=ForgotPasswordResponse)
async def forgot_password(
    otp_request: OTPRequest,
    db: Session = Depends(get_db)
):
    """Request password reset OTP"""
    otp = await AuthService.request_password_reset(db, otp_request.email)
    return {
        "message": "OTP sent to your email",
        "otp": otp
    }


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(
    otp_verify: OTPVerify,
    db: Session = Depends(get_db)
):
    """Reset password using OTP"""
    result = AuthService.reset_password(
        db=db,
        email=otp_verify.email,
        otp=otp_verify.otp_code,
        new_password=otp_verify.new_password
    )
    return result


@router.post("/change-password", response_model=MessageResponse)
def change_password(
    password_data: ChangePasswordRequest,
    current_user: dict = Depends(get_user),
    db: Session = Depends(get_db)
):
    """Change password for logged-in users"""
    return AuthService.change_password(
        db=db,
        user_id=current_user["user_id"],
        user_type=current_user["user_type"],
        current_password=password_data.current_password,
        new_password=password_data.new_password
    )


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
            "change_password": "/change-password",
            "logout": "/logout"
        }
    }
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
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
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    result = AuthService.login(db, email, password)
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

@router.post("/forgot-password")
def forgot_password(
    otp_request: OTPRequest,
    db: Session = Depends(get_db)
):
    otp = AuthService.request_password_reset(db, otp_request.email)
    return {
        "message": "OTP sent to your email",
        "otp": otp
    }

@router.post("/reset-password")
def reset_password(
    otp_verify: OTPVerify,
    db: Session = Depends(get_db)
):
    result = AuthService.reset_password(
        db=db,
        email=otp_verify.email,
        otp_code=otp_verify.otp_code,
        new_password=otp_verify.new_password
    )
    return result

@router.post("/logout")
def logout():
    return AuthService.logout()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "authentication",
        "endpoints": {
            "login": "/login",
            "register_student": "/student/register",
            "register_company": "/company/register",
            "forgot_password": "/forgot-password",
            "reset_password": "/reset-password",
            "logout": "/logout"
        }
    }
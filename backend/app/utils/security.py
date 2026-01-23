from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordBearer
from app.config import settings
from app.database import get_db
from sqlalchemy.orm import Session
from app.models import Company
from app.models import Student




security = HTTPBearer()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check if plain password matches hashed password"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash password using bcrypt"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create JWT token with user info
    Expected data: {"sub": email, "user_type": type, "user_id": id}
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> dict:
    """Decode and validate JWT token"""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_user(request: Request) -> dict:
    """
    Extract user info from JWT token from either:
    1. Authorization: Bearer <token> header, or
    2. auth_token cookie (httponly)
    
    Returns: {"user_id": int, "email": str, "user_type": str}
    """
    token = None
    
    # Try to get token from Authorization header first
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.replace("Bearer ", "")
    
    # Fallback to auth_token cookie if no bearer token
    if not token:
        token = request.cookies.get("auth_token")
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    payload = decode_access_token(token)
    
    # Extract from token payload (matches what create_access_token puts in)
    email = payload.get("sub")  # "sub" is standard JWT field for subject
    user_type = payload.get("user_type")
    user_id = payload.get("user_id")
    
    if not user_id or not email or not user_type:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    return {
        "user_id": user_id,
        "email": email,
        "user_type": user_type
    }

# Optional: Role-based access helpers
async def get_current_student(current_user: dict = Depends(get_user)) -> dict:
    """Ensure current user is a student"""
    if current_user["user_type"] != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Student access required"
        )
    return current_user

async def get_current_company(current_user: dict = Depends(get_user)) -> dict:
    """Ensure current user is a company"""
    if current_user["user_type"] != "company":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Company access required"
        )
    return current_user

async def get_current_admin(current_user: dict = Depends(get_user)) -> dict:
    """Ensure current user is an admin"""
    if current_user["user_type"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


def get_current_company_obj(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> Company:
    """Get the currently authenticated company object from JWT token (legacy function)"""
    token = credentials.credentials
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        company_id: int = payload.get("sub")
        user_type: str = payload.get("type")
        
        if company_id is None or user_type != "company":
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception
    
    company = db.query(Company).filter(Company.company_id == company_id).first()
    
    if company is None:
        raise credentials_exception
    
    return company


def get_current_student_obj(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> Student:
    """Get the currently authenticated student object from JWT token (legacy function)"""
    token = credentials.credentials
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        student_id: int = payload.get("sub")
        user_type: str = payload.get("type")
        
        if student_id is None or user_type != "student":
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception
    
    student = db.query(Student).filter(Student.student_id == student_id).first()
    
    if student is None:
        raise credentials_exception
    
    return student
def get_current_user_info(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> tuple:
    """
    Get current user type and ID from JWT token
    Returns: (user_type, user_id)
    """
    from jose import jwt, JWTError
    from app.config import settings
    
    token = credentials.credentials
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_type: str = payload.get("type")  # 'student' or 'company'
        user_id: int = payload.get("sub")
        
        if user_id is None or user_type is None:
            raise credentials_exception
        
        return user_type, user_id
            
    except JWTError:
        raise credentials_exception
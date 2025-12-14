from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import settings
#this file defines fcts we gonna use directly for password & token & identifying users

security = HTTPBearer()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#checks if a password = to the hashed one in db
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

#hash the password using bcrypt
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

#create a token using id, user_type and email (with expiration date)
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()

    # Calculate expiration
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    
    # Add expiration to the token data
    to_encode.update({"exp": expire})

    # Sign and encode
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

#this is a helper fct used inside get_user
def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
#extract user info from token use it with protected routes
async def get_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = credentials.credentials
    payload = decode_access_token(token)
    
    user_id = payload.get("id") 
    email = payload.get("email")
    user_type = payload.get("user_type")
    
    if not user_id or not email or not user_type:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    return {"id": user_id, "email": email, "user_type": user_type}
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, date
from decimal import Decimal

class StudentListResponse(BaseModel):
    student_id: int
    email: EmailStr
    first_name: str
    last_name: str
    establishment_id: int
    document_url: Optional[str]
    status: str
    is_email_verified: bool
    created_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class CompanyListResponse(BaseModel):
    company_id: int
    email: EmailStr
    company_name: str
    sector: str
    address: str
    document_url: Optional[str]
    logo_url: Optional[str]
    status: str
    is_email_verified: bool
    created_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class OfferListResponse(BaseModel):
    offer_id: int
    company_id: int
    title: str
    description: Optional[str]
    offer_type: str
    duration: Optional[str]
    salary_min: Optional[Decimal]
    salary_max: Optional[Decimal]
    location_mode: Optional[str]
    location: Optional[str]
    employment_type: Optional[str]
    visibility: bool
    is_active: bool
    expiration_date: Optional[date]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

#for statistics in dashboard
class UserStatsCategory(BaseModel):
    total: int
    pending: int
    approved: int
    rejected: int

class OfferStats(BaseModel):
    total: int
    active: int
    inactive: int

class StatisticsResponse(BaseModel):
    students: UserStatsCategory
    companies: UserStatsCategory
    offers: OfferStats
    
    class Config:
        from_attributes = True


class AdminListResponse(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    picture: Optional[str]

    class Config:
        from_attributes = True
from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime


# Application Creation
class ApplicationCreate(BaseModel):
    offer_id: int


# Status Update by Company
class ApplicationStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(received|in_review|interview_scheduled|accepted|rejected)$")
    
    @validator('status')
    def validate_status(cls, v):
        valid_statuses = ['received', 'in_review', 'interview_scheduled', 'accepted', 'rejected']
        if v not in valid_statuses:
            raise ValueError(f'Status must be one of: {", ".join(valid_statuses)}')
        return v


# Student Info --->>what company sees
class StudentBasicInfo(BaseModel):
    student_id: int
    first_name: str
    last_name: str
    email: str
    phone: Optional[str]
    speciality_id: Optional[int]
    establishment_id: Optional[int]
    
    class Config:
        from_attributes = True


# Offer Info (what student sees in their applications)
class OfferBasicInfo(BaseModel):
    offer_id: int
    title: str
    offer_type: str
    location: Optional[str]
    
    class Config:
        from_attributes = True


# Response for Students
class ApplicationResponse(BaseModel):
    application_id: int
    offer_id: int
    student_id: int
    status: str
    applied_at: datetime
    updated_at: datetime
    
    offer: OfferBasicInfo
    
    class Config:
        from_attributes = True


# Response for Companies
class ApplicationDetailResponse(BaseModel):
    application_id: int
    offer_id: int
    student_id: int
    status: str
    applied_at: datetime
    updated_at: datetime
    
    student: StudentBasicInfo
    
    class Config:
        from_attributes = True


# Statistics
class ApplicationStatistics(BaseModel):
    total_applications: int
    by_status: dict
    by_offer: dict
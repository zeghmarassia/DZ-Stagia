from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, date

from app.schemas.helper import EstablishmentResponse


class StudentUpdateProfile(BaseModel):
    first_name: Optional[str] = Field(None, max_length=50)
    last_name: Optional[str] = Field(None, max_length=50)
    phone: Optional[str] = Field(None, max_length=20)
    bio: Optional[str] = None
    portfolio_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    establishment_id: Optional[int] = None
    speciality_id: Optional[int] = None


class CVVisibilityToggle(BaseModel):
    visibility: bool


class AddEducationRequest(BaseModel):
    degree: str
    institution: str
    field_of_study: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: bool = False


class UpdateEducationRequest(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    field_of_study: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: Optional[bool] = None


class SkillInput(BaseModel):
    skill_id: int = Field(..., gt=0)
    proficiency_level: Optional[str] = None


class AddSkillsRequest(BaseModel):
    skills: List[SkillInput] = Field(..., min_items=1)


class SkillError(BaseModel):
    skill_id: int
    error: str

class SkillResponse(BaseModel):
    skill_id: int
    name: str
    category: Optional[str]
    proficiency_level: Optional[str]
    
    class Config:
        from_attributes = True


class AddSkillsResponse(BaseModel):
    added: List[SkillResponse]
    errors: Optional[List[SkillError]] = None


class StudentResponse(BaseModel):
    student_id: int
    email: str
    first_name: str
    last_name: str
    status: str
    is_email_verified: bool
    document_url: Optional[str]
    phone: Optional[str]
    cv_url: Optional[str]
    cv_visibility: bool
    bio: Optional[str]
    portfolio_url: Optional[str]
    github_url: Optional[str]
    linkedin_url: Optional[str]
    profile_pic: Optional[str]
    establishment_id: Optional[int]
    speciality_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class EducationResponse(BaseModel):
    education_id: int
    student_id: int
    degree: str
    institution: str
    field_of_study: Optional[str]
    start_date: Optional[date]
    end_date: Optional[date]
    is_current: bool
    
    class Config:
        from_attributes = True


class SkillResponse(BaseModel):
    skill_id: int
    name: str
    category: Optional[str]
    proficiency_level: Optional[str]


class StudentProfileResponse(BaseModel):
    profile: StudentResponse
    current_establishment: Optional[EstablishmentResponse]
    educations: List[EducationResponse] = []
    skills: List[SkillResponse] = []


class OfferResponse(BaseModel):
    offer_id: int
    company_id: int
    title: str
    description: Optional[str]
    offer_type: str
    location: Optional[str]
    visibility: bool
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class OffersListResponse(BaseModel):
    offers: List[OfferResponse]
    total: int


class ApplicationResponse(BaseModel):
    application_id: int
    offer_id: int
    student_id: int
    status: str
    applied_at: datetime
    
    class Config:
        from_attributes = True


class ApplicationsListResponse(BaseModel):
    applications: List[ApplicationResponse]
    total: int


class MessageResponse(BaseModel):
    message: str
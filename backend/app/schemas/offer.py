from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import date, datetime
from decimal import Decimal


# Base schemas for nested objects
class SkillBase(BaseModel):
    skill_id: int
    name: str
    
    class Config:
        from_attributes = True


class SpecialityBase(BaseModel):
    speciality_id: int
    name: str
    domain_id: int
    
    class Config:
        from_attributes = True


class EstablishmentBase(BaseModel):
    establishment_id: int
    name: str
    
    class Config:
        from_attributes = True


# Offer Creation Schema
class OfferCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    description: Optional[str] = None
    offer_type: str = Field(..., pattern="^(stage|pfe|emploi)$")
    duration: Optional[str] = None
    
    salary_min: Optional[Decimal] = Field(None, ge=0)
    salary_max: Optional[Decimal] = Field(None, ge=0)
    
    location_mode: Optional[str] = Field(None, pattern="^(remote|onsite|hybrid)$")
    location: Optional[str] = Field(None, max_length=255)
    employment_type: Optional[str] = Field(None, pattern="^(full_time|part_time|contract|internship)$")
    
    expiration_date: Optional[date] = None
    
    # Related entities (IDs)
    targeted_establishment_ids: Optional[List[int]] = []
    required_skill_ids: Optional[List[int]] = []
    required_speciality_ids: Optional[List[int]] = []
    
    @validator('salary_max')
    def validate_salary_range(cls, v, values):
        if v is not None and 'salary_min' in values and values['salary_min'] is not None:
            if v < values['salary_min']:
                raise ValueError('salary_max must be greater than or equal to salary_min')
        return v
    
    @validator('expiration_date')
    def validate_expiration_date(cls, v):
        if v is not None and v < date.today():
            raise ValueError('expiration_date must be in the future')
        return v


# Offer Update Schema
class OfferUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=200)
    description: Optional[str] = None
    offer_type: Optional[str] = Field(None, pattern="^(stage|pfe|emploi)$")
    duration: Optional[str] = None
    
    salary_min: Optional[Decimal] = Field(None, ge=0)
    salary_max: Optional[Decimal] = Field(None, ge=0)
    
    location_mode: Optional[str] = Field(None, pattern="^(remote|onsite|hybrid)$")
    location: Optional[str] = Field(None, max_length=255)
    employment_type: Optional[str] = Field(None, pattern="^(full_time|part_time|contract|internship)$")
    
    visibility: Optional[bool] = None
    is_active: Optional[bool] = None
    expiration_date: Optional[date] = None
    
    targeted_establishment_ids: Optional[List[int]] = None
    required_skill_ids: Optional[List[int]] = None
    required_speciality_ids: Optional[List[int]] = None


# Offer Response Schema
class OfferResponse(BaseModel):
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
    
    views_count: int
    applications_count: int
    
    created_at: datetime
    updated_at: datetime
    
    # Related entities
    targeted_establishments: List[EstablishmentBase] = []
    required_skills: List[SkillBase] = []
    required_specialities: List[SpecialityBase] = []
    
    class Config:
        from_attributes = True


# Offer List Item (simplified for list views)
class OfferListItem(BaseModel):
    offer_id: int
    company_id: int
    title: str
    offer_type: str
    location: Optional[str]
    salary_min: Optional[Decimal]
    salary_max: Optional[Decimal]
    expiration_date: Optional[date]
    created_at: datetime
    applications_count: int
    
    class Config:
        from_attributes = True


# Offer Search/Filter Parameters
class OfferSearchParams(BaseModel):
    keyword: Optional[str] = None
    offer_type: Optional[str] = None
    location: Optional[str] = None
    location_mode: Optional[str] = None
    employment_type: Optional[str] = None
    speciality_ids: Optional[List[int]] = None
    skill_ids: Optional[List[int]] = None
    min_salary: Optional[Decimal] = None
    max_salary: Optional[Decimal] = None
    
    page: int = Field(1, ge=1)
    page_size: int = Field(10, ge=1, le=100)


# Statistics Response
class OfferStatistics(BaseModel):
    total_offers: int
    active_offers: int
    expired_offers: int
    total_views: int
    total_applications: int
    offers_by_type: dict
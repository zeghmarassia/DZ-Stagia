from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class EstablishmentResponse(BaseModel):
    establishment_id: int
    name: str
    abbreviation: Optional[str]
    type: str
    address: str
    created_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class DomainResponse(BaseModel):
    domain_id: int
    name: str
    
    class Config:
        from_attributes = True


class SpecialityResponse(BaseModel):
    speciality_id: int
    name: str
    domain_id: int
    
    class Config:
        from_attributes = True


class SkillListResponse(BaseModel):
    skill_id: int
    name: str
    category: Optional[str]
    
    class Config:
        from_attributes = True
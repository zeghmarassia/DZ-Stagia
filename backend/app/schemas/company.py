from pydantic import BaseModel, EmailStr, HttpUrl, Field
from typing import Optional
from datetime import datetime

# Profil Company - Read

class CompanyProfileResponse(BaseModel):
    """Response avec le profil complet de l'entreprise"""
    company_id: int
    email: str
    company_name: str
    status: str
    is_email_verified: bool
    
    # Informations optionnelles du profil
    description: Optional[str] = None
    sector: Optional[str] = None
    logo_url: Optional[str] = None
    address: Optional[str] = None
    contact: Optional[str] = None
    website: Optional[str] = None
    
    # Document de vérification
    document_url: Optional[str] = None
    
    # Timestamps
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Profil Public 


class CompanyPublicProfile(BaseModel):
    """Profil public de l'entreprise """
    company_id: int
    company_name: str
    description: Optional[str] = None
    sector: Optional[str] = None
    logo_url: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# Upload Responses


class FileUploadResponse(BaseModel):
    """Réponse après upload d'un fichier"""
    message: str
    url: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "Logo uploaded successfully",
                "url": "https://res.cloudinary.com/..."
            }
        }




class MessageResponse(BaseModel):
    """Generic message response"""
    message: str

class CompanyPublicResponse(BaseModel):
    company_id: int
    name: str
    logo: Optional[str]
    description: Optional[str]
    sector: Optional[str]
    location: Optional[str]
    website: Optional[str]
    offers_count: int = 0 
    
    class Config:
        from_attributes = True
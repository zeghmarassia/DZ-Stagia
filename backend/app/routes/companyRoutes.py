from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.company import (
    CompanyProfileResponse,
    CompanyPublicProfile,
    FileUploadResponse,
    MessageResponse
)
from app.services.companyService import CompanyService
from app.utils.security import get_user, get_current_company
from typing import Optional


router = APIRouter(prefix="/company", tags=["Company"])


# Profil Entreprise 

@router.get("/profile", response_model=CompanyProfileResponse)
def get_my_profile(
    current_user: dict = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    """
    Récupérer le profil de l'entreprise connectée
    
    """
    company = CompanyService.get_profile(db, current_user["user_id"])
    return company


@router.put("/profile", response_model=CompanyProfileResponse)
def update_my_profile(
    company_name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    sector: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    contact: Optional[str] = Form(None),
    website: Optional[str] = Form(None),
    current_user: dict = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    """
    Mettre à jour le profil de l'entreprise
    
    """
    company = CompanyService.update_profile(
        db=db,
        company_id=current_user["user_id"],
        company_name=company_name,
        description=description,
        sector=sector,
        address=address,
        contact=contact,
        website=website
    )
    return company


# Upload Logo

@router.post("/upload-logo", response_model=FileUploadResponse)
async def upload_company_logo(
    logo: UploadFile = File(...),
    current_user: dict = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    """
    Upload du logo de l'entreprise sur Cloudinary
        
    .jpg, .jpeg, .png, .webp
    """
    result = await CompanyService.upload_logo(
        db=db,
        company_id=current_user["user_id"],
        logo_file=logo
    )
    return result


@router.delete("/logo", response_model=MessageResponse)
def delete_company_logo(
    current_user: dict = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    """
    Supprimer le logo de l'entreprise
    
    """
    result = CompanyService.delete_logo(db, current_user["user_id"])
    return result


# Profil Public (Sans Authentification)

@router.get("/{company_id}/public", response_model=CompanyPublicProfile)
def get_company_public_profile(
    company_id: int,
    db: Session = Depends(get_db)
):
    """
    Récupérer le profil public d'une entreprise
    
    """
    company = CompanyService.get_public_profile(db, company_id)
    return company


# Health Check

@router.get("/health")
def health_check():
    """Health check endpoint for company routes"""
    return {
        "status": "healthy",
        "service": "company",
        "endpoints": {
            "get_profile": "GET /company/profile",
            "update_profile": "PUT /company/profile",
            "upload_logo": "POST /company/upload-logo",
            "delete_logo": "DELETE /company/logo",
            "public_profile": "GET /company/{company_id}/public"
        }
    }
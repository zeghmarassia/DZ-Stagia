from sqlalchemy.orm import Session
from fastapi import HTTPException, status, UploadFile
from typing import Optional
from typing import List


from app.models.company import Company
from app.utils.storage import upload_company_logo, delete_company_logo


class CompanyService:
    
    @staticmethod
    def get_profile(db: Session, company_id: int) -> Company:
        """Récupérer le profil d'une entreprise par ID"""
        company = db.query(Company).filter(
            Company.company_id == company_id
        ).first()
        
        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found"
            )
        
        return company
    
    
    @staticmethod
    def get_public_profile(db: Session, company_id: int) -> Company:
        """Récupérer le profil public d'une entreprise (approved uniquement)"""
        company = db.query(Company).filter(
            Company.company_id == company_id,
            Company.status == "approved"  # Seulement les entreprises approuvées
        ).first()
        
        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found or not approved"
            )
        
        return company
    
    
    @staticmethod
    def update_profile(
        db: Session,
        company_id: int,
        company_name: Optional[str] = None,
        description: Optional[str] = None,
        sector: Optional[str] = None,
        address: Optional[str] = None,
        contact: Optional[str] = None,
        website: Optional[str] = None
    ) -> Company:
        """Mettre à jour le profil d'une entreprise"""
        company = db.query(Company).filter(
            Company.company_id == company_id
        ).first()
        
        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found"
            )
        
        # Vérifier que le compte est approved
        if company.status != "approved":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Cannot update profile. Account is {company.status}. Wait for admin approval."
            )
        
        # Mettre à jour uniquement les champs fournis
        if company_name is not None:
            company.company_name = company_name
        if description is not None:
            company.description = description
        if sector is not None:
            company.sector = sector
        if address is not None:
            company.address = address
        if contact is not None:
            company.contact = contact
        if website is not None:
            company.website = website
        
        try:
            db.commit()
            db.refresh(company)
            return company
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update profile: {str(e)}"
            )
    
    
    @staticmethod
    async def upload_logo(
        db: Session,
        company_id: int,
        logo_file: UploadFile
    ) -> dict:
        """Upload du logo de l'entreprise sur Cloudinary"""
        company = db.query(Company).filter(
            Company.company_id == company_id
        ).first()
        
        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found"
            )
        
        try:
            # Supprimer l'ancien logo si existe
            if company.logo_url:
                delete_company_logo(company.logo_url)
            
            # Upload le nouveau logo sur Cloudinary
            logo_url = await upload_company_logo(logo_file, company_id)
            
            # Mettre à jour BDD
            company.logo_url = logo_url
            db.commit()
            db.refresh(company)
            
            return {
                "message": "Logo uploaded successfully",
                "url": logo_url
            }
            
        except HTTPException:
            raise
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Logo upload failed: {str(e)}"
            )
    
    
    @staticmethod
    def delete_logo(db: Session, company_id: int) -> dict:
        """Supprimer le logo de l'entreprise"""
        company = db.query(Company).filter(
            Company.company_id == company_id
        ).first()
        
        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found"
            )
        
        if not company.logo_url:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No logo to delete"
            )
        
        try:
            # Supprimer de Cloudinary
            delete_company_logo(company.logo_url)
            
            # Mettre à jour BDD
            company.logo_url = None
            db.commit()
            
            return {"message": "Logo deleted successfully"}
            
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete logo: {str(e)}"
            )
@staticmethod
def get_all_companies(
    db: Session,
    page: int = 1,
    page_size: int = 10,
    order_by: str = "popular"  # "popular", "recent", "name"
) -> tuple[List[Company], int]:
    """
    order_by: 'populaنr' =by offers count, 'recent' =newest first=, 'name'= alphabeticalت
    """
    from sqlalchemy import func
    from app.models.offer import Offer
    
    query = db.query(Company)
    
    if order_by == "popular":
        # Order by number of active offers (most popular first)
        query = query.outerjoin(Offer).group_by(Company.company_id).order_by(
            func.count(Offer.offer_id).desc()
        )
    elif order_by == "recent":
        # Order by newest companies first
        query = query.order_by(Company.created_at.desc())
    elif order_by == "name":
        # Order alphabetically by name
        query = query.order_by(Company.name.asc())
    else:
        # Default: most popular
        query = query.outerjoin(Offer).group_by(Company.company_id).order_by(
            func.count(Offer.offer_id).desc()
        )
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    companies = query.offset((page - 1) * page_size).limit(page_size).all()
    
    return companies, total
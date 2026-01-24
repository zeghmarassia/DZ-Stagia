from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from fastapi import HTTPException, status
from typing import List
from datetime import date

from app.models.offer import Offer
from app.models.company import Company


class MainService:
    """Service for main page endpoints - public data for unauthenticated users"""
    
    @staticmethod
    def get_all_public_offers(
        db: Session,
        page: int = 1,
        page_size: int = 10,
        keyword: str = None
    ) -> dict:
        """
        Fetch all public offers that are active and visible
        Used for the main page homepage display
        Returns serialized offer data
        """
        query = db.query(Offer).filter(
            and_(
                Offer.visibility == True,
                Offer.is_active == True
            )
        )
        
        # Apply keyword search if provided
        if keyword:
            query = query.filter(
                Offer.title.ilike(f"%{keyword}%")
            )
        
        # Count total records
        total = query.count()
        
        # Apply pagination
        offset = (page - 1) * page_size
        offers = query.order_by(Offer.created_at.desc()).offset(offset).limit(page_size).all()
        
        # Serialize offers to dictionaries
        serialized_offers = []
        for offer in offers:
            serialized_offers.append({
                "offer_id": offer.offer_id,
                "company_id": offer.company_id,
                "title": offer.title,
                "description": offer.description,
                "offer_type": offer.offer_type,
                "duration": offer.duration,
                "salary_min": float(offer.salary_min) if offer.salary_min else None,
                "salary_max": float(offer.salary_max) if offer.salary_max else None,
                "location_mode": offer.location_mode,
                "location": offer.location,
                "employment_type": offer.employment_type,
                "visibility": offer.visibility,
                "is_active": offer.is_active,
                "expiration_date": offer.expiration_date.isoformat() if offer.expiration_date else None,
                "views_count": offer.views_count,
                "applications_count": offer.applications_count,
                "created_at": offer.created_at.isoformat(),
                "updated_at": offer.updated_at.isoformat(),
                "company": {
                    "company_id": offer.company.company_id,
                    "company_name": offer.company.company_name,
                    "logo_url": offer.company.logo_url,
                    "address": offer.company.address
                } if offer.company else None
            })
        
        return {
            "offers": serialized_offers,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size
        }
    
    @staticmethod
    def get_all_public_companies(
        db: Session,
        page: int = 1,
        page_size: int = 10,
        keyword: str = None
    ) -> dict:
        """
        Fetch all approved companies that can be displayed on the main page
        Used for the companies listing on homepage
        Returns serialized company data
        """
        query = db.query(Company).filter(
            Company.status == "approved"
        )
        
        # Apply keyword search if provided
        if keyword:
            query = query.filter(
                Company.company_name.ilike(f"%{keyword}%")
            )
        
        # Count total records
        total = query.count()
        
        # Apply pagination
        offset = (page - 1) * page_size
        companies = query.order_by(Company.created_at.desc()).offset(offset).limit(page_size).all()
        
        # Serialize companies to dictionaries
        serialized_companies = []
        for company in companies:
            serialized_companies.append({
                "company_id": company.company_id,
                "company_name": company.company_name,
                "description": company.description,
                "sector": company.sector,
                "logo_url": company.logo_url,
                "address": company.address,
                "contact": company.contact,
                "website": company.website,
                "created_at": company.created_at.isoformat(),
                "updated_at": company.updated_at.isoformat()
            })
        
        return {
            "companies": serialized_companies,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size
        }
    
    @staticmethod
    def get_public_offers_count(db: Session) -> int:
        """Get total count of public offers"""
        return db.query(func.count(Offer.offer_id)).filter(
            and_(
                Offer.visibility == True,
                Offer.is_active == True
            )
        ).scalar()
    
    @staticmethod
    def get_public_companies_count(db: Session) -> int:
        """Get total count of approved companies"""
        return db.query(func.count(Company.company_id)).filter(
            Company.status == "approved"
        ).scalar()

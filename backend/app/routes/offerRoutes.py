
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.offer import (
    OfferCreate, 
    OfferUpdate, 
    OfferResponse, 
    OfferListItem,
    OfferSearchParams,
    OfferStatistics
)
from app.services.offerService import OfferService
from app.utils.security import get_current_company, get_current_student

router = APIRouter(prefix="/offers", tags=["Offers"])


# ==================== Company Endpoints ====================

@router.post("/", response_model=OfferResponse, status_code=status.HTTP_201_CREATED)
def create_offer(
    offer_data: OfferCreate,
    db: Session = Depends(get_db),
    current_company = Depends(get_current_company)
):
    """Create a new offer (Company only)"""
    offer = OfferService.create_offer(db, offer_data, current_company.company_id)
    return offer


@router.get("/my-offers", response_model=dict)
def get_my_offers(
    include_inactive: bool = Query(False, description="Include inactive offers"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_company = Depends(get_current_company)
):
    """Get all offers for the authenticated company"""
    offers, total = OfferService.get_company_offers(
        db, 
        current_company.company_id, 
        include_inactive,
        page,
        page_size
    )
    
    return {
        "offers": offers,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }


@router.get("/my-offers/statistics", response_model=OfferStatistics)
def get_my_offer_statistics(
    db: Session = Depends(get_db),
    current_company = Depends(get_current_company)
):
    """Get statistics for company's offers"""
    return OfferService.get_offer_statistics(db, current_company.company_id)


# ==================== Student Endpoints ====================

@router.get("/search/student", response_model=dict)
def search_offers_for_students(
    keyword: str = Query(None, description="Search keyword"),
    offer_type: str = Query(None, description="Type: stage, pfe, emploi"),
    location: str = Query(None, description="Location filter"),
    location_mode: str = Query(None, description="Mode: remote, onsite, hybrid"),
    employment_type: str = Query(None, description="Type: full_time, part_time, contract, internship"),
    min_salary: float = Query(None, ge=0),
    max_salary: float = Query(None, ge=0),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_student = Depends(get_current_student)
):
    """Search offers visible to the authenticated student with filters"""
    search_params = OfferSearchParams(
        keyword=keyword,
        offer_type=offer_type,
        location=location,
        location_mode=location_mode,
        employment_type=employment_type,
        min_salary=min_salary,
        max_salary=max_salary,
        page=page,
        page_size=page_size
    )
    
    offers, total = OfferService.search_offers_for_student(
        db, 
        current_student.student_id, 
        search_params
    )
    
    return {
        "offers": offers,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }


@router.get("/matched/student", response_model=List[OfferResponse])
def get_matched_offers(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_student = Depends(get_current_student)
):
    """Get offers that match student's speciality (for homepage priority)"""
    offers = OfferService.get_matched_offers_for_student(
        db, 
        current_student.student_id, 
        limit
    )
    return offers


@router.get("/view/{offer_id}", response_model=OfferResponse)
def view_offer_as_student(
    offer_id: int,
    db: Session = Depends(get_db),
    current_student = Depends(get_current_student)
):
    """View a specific offer as a student (increments view count)"""
    offer = OfferService.get_offer_by_id(db, offer_id)
    
    if not offer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Offer not found"
        )
    
    # Check if offer is visible to this student
    if not offer.is_visible_to_student(current_student):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This offer is not available to you"
        )
    
    # Increment view count
    OfferService.increment_offer_views(db, offer_id)
    
    return offer


# ==================== Company Endpoints (Dynamic) ====================

@router.get("/{offer_id}", response_model=OfferResponse)
def get_offer_detail(
    offer_id: int,
    db: Session = Depends(get_db),
    current_company = Depends(get_current_company)
):
    """Get detailed information about a specific offer (Company only)"""
    offer = OfferService.get_offer_by_id(db, offer_id)
    
    if not offer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Offer not found"
        )
    
    # Verify ownership
    if offer.company_id != current_company.company_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to view this offer"
        )
    
    return offer


@router.put("/{offer_id}", response_model=OfferResponse)
def update_offer(
    offer_id: int,
    offer_data: OfferUpdate,
    db: Session = Depends(get_db),
    current_company = Depends(get_current_company)
):
    """Update an existing offer (Company only)"""
    offer = OfferService.update_offer(db, offer_id, offer_data, current_company.company_id)
    return offer


@router.delete("/{offer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_offer(
    offer_id: int,
    db: Session = Depends(get_db),
    current_company = Depends(get_current_company)
):
    """Delete (archive) an offer (Company only)"""
    OfferService.delete_offer(db, offer_id, current_company.company_id)
    return None

@router.get("/public/list", response_model=dict)
def list_public_offers(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get public list of active offers (no authentication required)"""
    from app.models.offer import Offer
    from datetime import date
    from sqlalchemy import or_
    
    query = db.query(Offer).filter(
        Offer.is_active == True,
        Offer.visibility == True,
        or_(
            Offer.expiration_date == None,
            Offer.expiration_date >= date.today()
        )
    )
    
    total = query.count()
    offers = query.order_by(Offer.created_at.desc()).offset(
        (page - 1) * page_size
    ).limit(page_size).all()
    
    return {
        "offers": offers,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }
@router.get("/all", response_model=dict)
def get_all_offers_list(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    include_inactive: bool = Query(False, description="Include inactive offers"),
    include_expired: bool = Query(False, description="Include expired offers"),
    db: Session = Depends(get_db)
):
    """
    Get all offers (public endpoint)
    """
    offers, total = OfferService.get_all_offers(
        db, 
        page, 
        page_size, 
        include_inactive, 
        include_expired
    )
    
    return {
        "offers": offers,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }
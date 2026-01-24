from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.services.mainService import MainService

router = APIRouter(prefix="/main", tags=["Main"])


# ==================== Public Endpoints ====================

@router.get("/public-offers", response_model=dict)
def get_public_offers(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    keyword: str = Query(None, description="Search by title keyword"),
    db: Session = Depends(get_db)
):
    """
    Get all public offers for the main page
    - Accessible to everyone (no authentication required)
    - Returns active and visible offers only
    """
    result = MainService.get_all_public_offers(
        db,
        page=page,
        page_size=page_size,
        keyword=keyword
    )
    return result


@router.get("/public-companies", response_model=dict)
def get_public_companies(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    keyword: str = Query(None, description="Search by company name keyword"),
    db: Session = Depends(get_db)
):
    """
    Get all approved companies for the main page
    - Accessible to everyone (no authentication required)
    - Returns only approved companies
    """
    result = MainService.get_all_public_companies(
        db,
        page=page,
        page_size=page_size,
        keyword=keyword
    )
    return result


@router.get("/stats", response_model=dict)
def get_main_statistics(
    db: Session = Depends(get_db)
):
    """
    Get statistics for the main page dashboard
    - Total public offers count
    - Total approved companies count
    """
    return {
        "public_offers_count": MainService.get_public_offers_count(db),
        "public_companies_count": MainService.get_public_companies_count(db)
    }


@router.get("/public-offers/{offer_id}", response_model=dict)
def get_public_offer_details(
    offer_id: int,
    db: Session = Depends(get_db)
):
    """
    Get details of a public offer
    - Accessible to everyone (no authentication required)
    - Returns offer details only if it's public and active
    """
    return MainService.get_public_offer_details(db, offer_id)

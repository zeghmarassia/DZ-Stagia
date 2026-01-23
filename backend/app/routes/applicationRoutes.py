from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.schemas.application import (
    ApplicationCreate,
    ApplicationStatusUpdate,
    ApplicationResponse,
    ApplicationDetailResponse,
    ApplicationStatistics
)
from app.services.applicationService import ApplicationService
from app.utils.security import get_current_company, get_current_student

router = APIRouter(prefix="/applications", tags=["Applications"])


#Student Endpoints

@router.post("/", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply_to_offer(
    application_data: ApplicationCreate,
    db: Session = Depends(get_db),
    current_student = Depends(get_current_student)
):
    """
    Student applies to an offer (one-click apply)
    """
    application = ApplicationService.create_application(
        db, 
        application_data, 
        current_student.student_id
    )
    return application


@router.get("/my-applications", response_model=dict)
def get_my_applications(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_student = Depends(get_current_student)
):
    """
    Get all applications for the authenticated student
    """
    applications, total = ApplicationService.get_student_applications(
        db,
        current_student.student_id,
        page,
        page_size
    )
    
    return {
        "applications": applications,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }


@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_student = Depends(get_current_student)
):
    """
    Student cancels their application (only if status is 'received' or 'in_review')
    """
    ApplicationService.cancel_application(db, application_id, current_student.student_id)
    return None


#Company Endpoints

@router.get("/offer/{offer_id}", response_model=dict)
def get_offer_applications(
    offer_id: int,
    status_filter: Optional[str] = Query(None, description="Filter by status"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_company = Depends(get_current_company)
):
    """
    Get all applications for a specific offer (Company only)
    """
    applications, total = ApplicationService.get_offer_applications(
        db,
        offer_id,
        current_company.company_id,
        status_filter,
        page,
        page_size
    )
    
    return {
        "applications": applications,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }


@router.get("/company/all", response_model=dict)
def get_all_company_applications(
    status_filter: Optional[str] = Query(None, description="Filter by status"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_company = Depends(get_current_company)
):
    """
    Get all applications across all company's offers
    """
    applications, total = ApplicationService.get_company_all_applications(
        db,
        current_company.company_id,
        status_filter,
        page,
        page_size
    )
    
    return {
        "applications": applications,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }


@router.put("/{application_id}/status", response_model=ApplicationDetailResponse)
def update_application_status(
    application_id: int,
    status_data: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_company = Depends(get_current_company)
):
    """
    Company updates the status of an application
    """
    application = ApplicationService.update_application_status(
        db,
        application_id,
        status_data,
        current_company.company_id
    )
    return application


@router.get("/company/statistics", response_model=ApplicationStatistics)
def get_application_statistics(
    db: Session = Depends(get_db),
    current_company = Depends(get_current_company)
):
    """
    Get statistics for all company applications
    """
    return ApplicationService.get_application_statistics(db, current_company.company_id)
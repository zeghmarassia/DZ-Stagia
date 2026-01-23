from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.services.adminService import AdminService
from app.schemas.admin import (
    StudentListResponse,
    CompanyListResponse,
    OfferListResponse,
    StatisticsResponse,
    AdminListResponse
)
from app.utils.security import get_current_admin

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    dependencies=[Depends(get_current_admin)]
)

@router.get("/students/pending", response_model=List[StudentListResponse])
def get_pending_students(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    return AdminService.get_pending_students(db, skip, limit)

@router.get("/students", response_model=List[StudentListResponse])
def get_approved_students(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    return AdminService.get_approved_students(db, skip, limit)

@router.put("/students/{student_id}/approve", response_model=StudentListResponse)
async def approve_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    return await AdminService.approve_student(db, student_id)

@router.put("/students/{student_id}/reject")
async def reject_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    return await AdminService.reject_student(db, student_id)

@router.delete("/students/{student_id}")
async def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    return await AdminService.delete_student(db, student_id)

@router.get("/companies/pending", response_model=List[CompanyListResponse])
def get_pending_companies(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    return AdminService.get_pending_companies(db, skip, limit)

@router.get("/companies", response_model=List[CompanyListResponse])
def get_approved_companies(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    return AdminService.get_approved_companies(db, skip, limit)


@router.get("/admins", response_model=List[AdminListResponse])
def get_admins(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    return AdminService.get_all_admins(db, skip, limit)

@router.put("/companies/{company_id}/approve", response_model=CompanyListResponse)
async def approve_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    return await AdminService.approve_company(db, company_id)

@router.put("/companies/{company_id}/reject")
async def reject_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    return await AdminService.reject_company(db, company_id)

@router.delete("/companies/{company_id}")
async def delete_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    return await AdminService.delete_company(db, company_id)

@router.get("/offers", response_model=List[OfferListResponse])
def get_all_offers(
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    return AdminService.get_all_offers(db, is_active, skip, limit)

@router.delete("/offers/{offer_id}")
async def delete_offer(
    offer_id: int,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    return await AdminService.delete_offer(db, offer_id)

@router.get("/stats", response_model=StatisticsResponse)
def get_statistics(
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    return AdminService.get_statistics(db)
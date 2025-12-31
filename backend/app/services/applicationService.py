from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_, func
from fastapi import HTTPException, status
from typing import List, Optional

from app.models.application import Application
from app.models.offer import Offer
from app.models.student import Student
from app.models.company import Company
from app.schemas.application import (
    ApplicationCreate, 
    ApplicationStatusUpdate, 
    ApplicationStatistics
)


class ApplicationService:
    
    @staticmethod
    def create_application(
        db: Session, 
        application_data: ApplicationCreate,
        student_id: int
    ) -> Application:
        """Student applies to an offer - ONE CLICK!"""
        
        # Verify offer exists and is active
        offer = db.query(Offer).filter(Offer.offer_id == application_data.offer_id).first()
        if not offer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Offer not found"
            )
        
        if not offer.is_active or not offer.visibility:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This offer is no longer available"
            )
        
        if offer.is_expired():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This offer has expired"
            )
        
        # Check if student already  ضapplied
        existing = db.query(Application).filter(
            Application.student_id == student_id,
            Application.offer_id == application_data.offer_id
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already applied to this offer"
            )
        
        # Verify student exists
        student = db.query(Student).filter(Student.student_id == student_id).first()
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found"
            )
        
        # Check if offer is visible to this student
        if not offer.is_visible_to_student(student):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This offer is not available for your establishment"
            )
        
        # Create application - SIMPLE!
        new_application = Application(
            student_id=student_id,
            offer_id=application_data.offer_id,
            status='received'
        )
        
        db.add(new_application)
        
        # Increment offer's appتlication count
        offer.increment_applications()
        
        db.commit()
        db.refresh(new_application)
        
        return new_application
    
    
    @staticmethod
    def get_student_applications(
        db: Session, 
        student_id: int,
        page: int = 1,
        page_size: int = 10
    ) -> tuple[List[Application], int]:
        """Get all applications for a student"""
        
        query = db.query(Application).options(
            joinedload(Application.offer).joinedload(Offer.company)
        ).filter(Application.student_id == student_id)
        
        total = query.count()
        
        applications = query.order_by(Application.applied_at.desc()).offset(
            (page - 1) * page_size
        ).limit(page_size).all()
        
        return applications, total
    
    
    @staticmethod
    def get_offer_applications(
        db: Session, 
        offer_id: int,
        company_id: int,
        status_filter: Optional[str] = None,
        page: int = 1,
        page_size: int = 10
    ) -> tuple[List[Application], int]:
        """Get all applications for a specific offer (company only)"""
        
        # Verify offer exists and belongs to this company
        offer = db.query(Offer).filter(Offer.offer_id == offer_id).first()
        if not offer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Offer not found"
            )
        
        if offer.company_id != company_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to view applications for this offer"
            )
        
        query = db.query(Application).options(
            joinedload(Application.student)
        ).filter(Application.offer_id == offer_id)
        
        # Apply status filter
        if status_filter:
            query = query.filter(Application.status == status_filter)
        
        total = query.count()
        
        applications = query.order_by(Application.applied_at.desc()).offset(
            (page - 1) * page_size
        ).limit(page_size).all()
        
        return applications, total
    
    
    @staticmethod
    def update_application_status(
        db: Session,
        application_id: int,
        status_data: ApplicationStatusUpdate,
        company_id: int
    ) -> Application:
        """Company updates the status of an application"""
        
        application = db.query(Application).options(
            joinedload(Application.offer)
        ).filter(Application.application_id == application_id).first()
        
        if not application:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application not found"
            )
        
        # Verify the offer belongs to this company
        if application.offer.company_id != company_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to modify this application"
            )
        
        # Validate status transition
        if not application.can_change_status_to(status_data.status):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot change status from '{application.status}' to '{status_data.status}'"
            )
        
        # Update status
        application.status = status_data.status
        
        db.commit()
        db.refresh(application)
        
        # TODO: Send notification to student about status change
        
        return application
    
    
    @staticmethod
    def cancel_application(
        db: Session,
        application_id: int,
        student_id: int
    ):
        """Student cancels their application"""
        
        application = db.query(Application).filter(
            Application.application_id == application_id
        ).first()
        
        if not application:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application not found"
            )
        
        # Verify ownership
        if application.student_id != student_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to cancel this application"
            )
        
        # Check if can be cancelled
        if not application.can_be_modified_by_student():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot cancel application with status '{application.status}'"
            )
        
        # Get offer to decrement counter
        offer = db.query(Offer).filter(Offer.offer_id == application.offer_id).first()
        if offer:
            offer.applications_count = max(0, offer.applications_count - 1)
        
        db.delete(application)
        db.commit()
    
    
    @staticmethod
    def get_company_all_applications(
        db: Session,
        company_id: int,
        status_filter: Optional[str] = None,
        page: int = 1,
        page_size: int = 10
    ) -> tuple[List[Application], int]:
        """Get all applications across all company's offers"""
        
        query = db.query(Application).options(
            joinedload(Application.student),
            joinedload(Application.offer)
        ).join(Offer).filter(Offer.company_id == company_id)
        
        if status_filter:
            query = query.filter(Application.status == status_filter)
        
        total = query.count()
        
        applications = query.order_by(Application.applied_at.desc()).offset(
            (page - 1) * page_size
        ).limit(page_size).all()
        
        return applications, total
    
    
    @staticmethod
    def get_application_statistics(
        db: Session,
        company_id: int
    ) -> ApplicationStatistics:
        """Get statistics for all company applications"""
        
        applications = db.query(Application).join(Offer).filter(
            Offer.company_id == company_id
        ).all()
        
        by_status = {}
        by_offer = {}
        
        for app in applications:
            # Count by status
            by_status[app.status] = by_status.get(app.status, 0) + 1
            
            # Count by offer
            by_offer[app.offer_id] = by_offer.get(app.offer_id, 0) + 1
        
        return ApplicationStatistics(
            total_applications=len(applications),
            by_status=by_status,
            by_offer=by_offer
        )
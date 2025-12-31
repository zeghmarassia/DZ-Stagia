from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
from typing import List, Dict, Any


from app.models import Student, Company, Offer, Admin
from app.services.emailService import EmailService
from app.utils.storage import delete_student_document, delete_company_document
from app.services.notificationService import NotificationService



class AdminService:
    
    @staticmethod
    def get_pending_students(db: Session, skip: int = 0, limit: int = 100) -> List[Student]:
        return db.query(Student).filter(
            Student.status == 'pending'
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_pending_companies(db: Session, skip: int = 0, limit: int = 100) -> List[Company]:
        return db.query(Company).filter(
            Company.status == 'pending'
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    async def approve_student(db: Session, student_id: int) -> Student:
        student = db.query(Student).filter(Student.student_id == student_id).first()
        
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found"
            )
        
        if student.status == 'approved':
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Student already approved"
            )
        
        student.status = 'approved'
        db.commit()
        db.refresh(student)
        
        await EmailService.send_approval_email(
            email=student.email,
            user_type="student",
            approved=True,
            name=f"{student.first_name} {student.last_name}"
        )
        NotificationService.notify_account_approved(
            db=db,
            user_type='student',
            user_id=student.student_id,
            user_email=student.email
        )
        return student
    
    @staticmethod
    async def reject_student(db: Session, student_id: int) -> Dict[str, str]:
        student = db.query(Student).filter(Student.student_id == student_id).first()
        
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found"
            )
        
        if student.status == 'rejected':
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Student already rejected"
            )
        
        try:
            if student.document_url:
                await delete_student_document(student.document_url)
                print(f"Deleted document: {student.document_url}")
        except Exception as e:
            print(f"failed to delete document: {e}")
        
        try:
            await EmailService.send_approval_email(
                email=student.email,
                user_type="student",
                approved=False,
                name=f"{student.first_name} {student.last_name}"
            )
        except Exception as e:
            print(f"Email failed but continuing deletion: {e}")
        
        email_copy = student.email
        db.delete(student)
        db.commit()
        
        return {"message": f"Student {email_copy} rejected and deleted"}
        NotificationService.notify_account_rejected(
            db=db,
            user_type='student',
            user_id=student.student_id,
            user_email=student.email,
            reason=reason
        )
    
    @staticmethod
    async def approve_company(db: Session, company_id: int) -> Company:
        company = db.query(Company).filter(Company.company_id == company_id).first()
        
        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found"
            )
        
        if company.status == 'approved':
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Company already approved"
            )
        
        company.status = 'approved'
        db.commit()
        db.refresh(company)
        
        await EmailService.send_approval_email(
            email=company.email,
            user_type="company",
            approved=True,
            name=company.company_name
        )
        NotificationService.notify_account_approved(
            db=db,
            user_type='company',
            user_id=company.company_id,
            user_email=company.email
        )
        
        return company
    
    @staticmethod
    async def reject_company(db: Session, company_id: int) -> Dict[str, str]:
        company = db.query(Company).filter(Company.company_id == company_id).first()
        
        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found"
            )
        
        if company.status == 'rejected':
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Company already rejected"
            )
        # Try to delete any uploaded document first
        try:
            if getattr(company, 'document_url', None):
                delete_company_document(company.document_url)
                print(f"Deleted company document: {company.document_url}")
        except Exception as e:
            print(f"failed to delete company document: {e}")

        # Send rejection email (non-blocking)
        try:
            await EmailService.send_approval_email(
                email=company.email,
                user_type="company",
                approved=False,
                name=company.company_name
            )
        except Exception as e:
            print(f"Email failed but continuing deletion: {e}")

        email_copy = company.email
        db.delete(company)
        db.commit()

        return {"message": f"Company {email_copy} rejected and deleted"}
        NotificationService.notify_account_rejected(
            db=db,
            user_type='company',
            user_id=company.company_id,
            user_email=company.email,
            reason=reason
        )
        return company

    
    @staticmethod
    def get_approved_students(db: Session, skip: int = 0, limit: int = 100) -> List[Student]:
        return db.query(Student).filter(
            Student.status == 'approved'
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_approved_companies(db: Session, skip: int = 0, limit: int = 100) -> List[Company]:
        return db.query(Company).filter(
            Company.status == 'approved'
        ).offset(skip).limit(limit).all()

    @staticmethod
    def get_all_admins(db: Session, skip: int = 0, limit: int = 100) -> List[Dict[str, str]]:
        """Return basic admin info: first_name, last_name, email, picture"""
        admins = db.query(Admin).offset(skip).limit(limit).all()
        return [
            {
                "first_name": a.first_name,
                "last_name": a.last_name,
                "email": a.email,
                "picture": getattr(a, "picture", None)
            }
            for a in admins
        ]
    
    @staticmethod
    async def delete_student(db: Session, student_id: int) -> Dict[str, str]:
        student = db.query(Student).filter(Student.student_id == student_id).first()
        
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found"
            )
        
        if student.status != 'approved':
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Can only delete approved students"
            )
        
        # Send deletion email
        try:
            await EmailService.send_account_deletion_email(
                email=student.email,
                name=f"{student.first_name} {student.last_name}",
                user_type="student"
            )
        except Exception as e:
            print(f"Email notification failed but continuing deletion: {e}")
        
        email_copy = student.email
        db.delete(student)
        db.commit()
        
        return {"message": f"Student {email_copy} deleted successfully"}
    
    
    @staticmethod
    async def delete_company(db: Session, company_id: int) -> Dict[str, str]:
        company = db.query(Company).filter(Company.company_id == company_id).first()
        
        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found"
            )
        
        if company.status != 'approved':
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Can only delete approved companies"
            )
        
        # Send deletion email
        try:
            await EmailService.send_account_deletion_email(
                email=company.email,
                name=company.company_name,
                user_type="company"
            )
        except Exception as e:
            print(f"Email notification failed but continuing deletion: {e}")
        
        company_name = company.company_name
        db.delete(company)
        db.commit()
        
        return {"message": f"Company {company_name} deleted successfully"}
    
    @staticmethod
    def get_all_offers(
        db: Session,
        is_active: bool = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Offer]:
        query = db.query(Offer)
        
        if is_active is not None:
            query = query.filter(Offer.is_active == is_active)
        
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    async def delete_offer(db: Session, offer_id: int) -> Dict[str, str]:
        offer = db.query(Offer).filter(Offer.offer_id == offer_id).first()

        if not offer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Offer not found"
            )

        # Fetch company to notify
        company = db.query(Company).filter(Company.company_id == offer.company_id).first()

        # Send notification to company (best-effort)
        try:
            if company and getattr(company, 'email', None):
                await EmailService.send_offer_deletion_email(
                    email=company.email,
                    company_name=getattr(company, 'company_name', 'Company'),
                    offer_title=offer.title
                )
        except Exception as e:
            print(f"Offer deletion email failed but continuing deletion: {e}")

        title = offer.title
        db.delete(offer)
        db.commit()

        return {"message": f"Offer '{title}' deleted successfully"}
    
    @staticmethod
    def get_statistics(db: Session) -> Dict[str, Any]:
        # Students counts
        pending_students = db.query(func.count(Student.student_id)).filter(Student.status == 'pending').scalar() or 0
        approved_students = db.query(func.count(Student.student_id)).filter(Student.status == 'approved').scalar() or 0
        rejected_students = db.query(func.count(Student.student_id)).filter(Student.status == 'rejected').scalar() or 0

        # Companies counts
        pending_companies = db.query(func.count(Company.company_id)).filter(Company.status == 'pending').scalar() or 0
        approved_companies = db.query(func.count(Company.company_id)).filter(Company.status == 'approved').scalar() or 0
        rejected_companies = db.query(func.count(Company.company_id)).filter(Company.status == 'rejected').scalar() or 0

        # Offers counts
        total_offers = db.query(func.count(Offer.offer_id)).scalar() or 0
        active_offers = db.query(func.count(Offer.offer_id)).filter(Offer.is_active == True).scalar() or 0
        inactive_offers = total_offers - active_offers

        return {
            "students": {
                "total": int(pending_students + approved_students + rejected_students),
                "pending": int(pending_students),
                "approved": int(approved_students),
                "rejected": int(rejected_students)
            },
            "companies": {
                "total": int(pending_companies + approved_companies + rejected_companies),
                "pending": int(pending_companies),
                "approved": int(approved_companies),
                "rejected": int(rejected_companies)
            },
            "offers": {
                "total": int(total_offers),
                "active": int(active_offers),
                "inactive": int(inactive_offers)
            }
        }
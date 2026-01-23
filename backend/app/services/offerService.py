
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_, func
from fastapi import HTTPException, status
from typing import List, Optional
from datetime import date

from app.models.offer import Offer
from app.models.establishment import Establishment
from app.models.skill import Skill
from app.models.speciality import Speciality
from app.models.company import Company
from app.models.student import Student
from app.schemas.offer import OfferCreate, OfferUpdate, OfferSearchParams, OfferStatistics


class OfferService:
    
    @staticmethod
    def create_offer(db: Session, offer_data: OfferCreate, company_id: int) -> Offer:
        """Create a new offer"""
        
        # Verify company exists
        company = db.query(Company).filter(Company.company_id == company_id).first()
        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found"
            )
        
        # Create the offer
        new_offer = Offer(
            company_id=company_id,
            title=offer_data.title,
            description=offer_data.description,
            offer_type=offer_data.offer_type,
            duration=offer_data.duration,
            salary_min=offer_data.salary_min,
            salary_max=offer_data.salary_max,
            location_mode=offer_data.location_mode,
            location=offer_data.location,
            employment_type=offer_data.employment_type,
            expiration_date=offer_data.expiration_date,
        )
        
        # Add targeted establishments
        if offer_data.targeted_establishment_ids:
            establishments = db.query(Establishment).filter(
                Establishment.establishment_id.in_(offer_data.targeted_establishment_ids)
            ).all()
            new_offer.targeted_establishments = establishments
        
        # Add required skills
        if offer_data.required_skill_ids:
            skills = db.query(Skill).filter(
                Skill.skill_id.in_(offer_data.required_skill_ids)
            ).all()
            new_offer.required_skills = skills
        
        # Add required specialities
        if offer_data.required_speciality_ids:
            specialities = db.query(Speciality).filter(
                Speciality.speciality_id.in_(offer_data.required_speciality_ids)
            ).all()
            new_offer.required_specialities = specialities
        
        db.add(new_offer)
        db.commit()
        db.refresh(new_offer)
        
        return new_offer
    
    
    @staticmethod
    def get_offer_by_id(db: Session, offer_id: int, include_relations: bool = True) -> Optional[Offer]:
        """Get an offer by ID with optional relationships"""
        query = db.query(Offer)
        
        if include_relations:
            query = query.options(
                joinedload(Offer.targeted_establishments),
                joinedload(Offer.required_skills),
                joinedload(Offer.required_specialities),
                joinedload(Offer.company)
            )
        
        return query.filter(Offer.offer_id == offer_id).first()
    
    
    @staticmethod
    def update_offer(db: Session, offer_id: int, offer_data: OfferUpdate, company_id: int) -> Offer:
        """Update an existing offer"""
        
        offer = db.query(Offer).filter(Offer.offer_id == offer_id).first()
        
        if not offer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Offer not found"
            )
        
        # Verify ownership
        if offer.company_id != company_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to update this offer"
            )
        
        # Update fields
        update_data = offer_data.dict(exclude_unset=True)
        
        # Handle related entities separately
        targeted_establishment_ids = update_data.pop('targeted_establishment_ids', None)
        required_skill_ids = update_data.pop('required_skill_ids', None)
        required_speciality_ids = update_data.pop('required_speciality_ids', None)
        
        # Update simple fields
        for field, value in update_data.items():
            setattr(offer, field, value)
        
        # Update targeted establishments
        if targeted_establishment_ids is not None:
            establishments = db.query(Establishment).filter(
                Establishment.establishment_id.in_(targeted_establishment_ids)
            ).all()
            offer.targeted_establishments = establishments
        
        # Update required skills
        if required_skill_ids is not None:
            skills = db.query(Skill).filter(
                Skill.skill_id.in_(required_skill_ids)
            ).all()
            offer.required_skills = skills
        
        # Update required specialities
        if required_speciality_ids is not None:
            specialities = db.query(Speciality).filter(
                Speciality.speciality_id.in_(required_speciality_ids)
            ).all()
            offer.required_specialities = specialities
        
        db.commit()
        db.refresh(offer)
        
        return offer
    
    
    @staticmethod
    def delete_offer(db: Session, offer_id: int, company_id: int):
        """Delete (archive) an offer"""
        
        offer = db.query(Offer).filter(Offer.offer_id == offer_id).first()
        
        if not offer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Offer not found"
            )
        
        # Verify ownership
        if offer.company_id != company_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to delete this offer"
            )
        
        offer.is_active = False
        db.commit()
    
    
    @staticmethod
    def get_company_offers(
        db: Session, 
        company_id: int, 
        include_inactive: bool = False,
        page: int = 1,
        page_size: int = 10
    ) -> tuple[List[Offer], int]:
        """Get all offers for a company with pagination"""
        
        query = db.query(Offer).filter(Offer.company_id == company_id)
        
        if not include_inactive:
            query = query.filter(Offer.is_active == True)
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        offers = query.order_by(Offer.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
        
        return offers, total
    
    
    @staticmethod
    def search_offers_for_student(
        db: Session,
        student_id: int,
        search_params: OfferSearchParams
    ) -> tuple[List[Offer], int]:
        """Search offers visible to a student with filters"""
        
        # Get student to check establishment
        student = db.query(Student).filter(Student.student_id == student_id).first()
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found"
            )
        
        query = db.query(Offer).options(
            joinedload(Offer.company),
            joinedload(Offer.required_skills),
            joinedload(Offer.required_specialities)
        )
        
        # active, visible, not expired
        query = query.filter(
            Offer.is_active == True,
            Offer.visibility == True,
            or_(
                Offer.expiration_date == None,
                Offer.expiration_date >= date.today()
            )
        )
        
        # Filter by establishment targeting
        from app.models.offer_establishment import offer_establishment
        
        subquery = db.query(offer_establishment.c.offer_id).filter(
            offer_establishment.c.establishment_id == student.establishment_id
        ).subquery()
        
        query = query.filter(
            or_(
                ~Offer.targeted_establishments.any(),
                Offer.offer_id.in_(subquery)
            )
        )
        
        # Apply search filters
        if search_params.keyword:
            keyword_filter = f"%{search_params.keyword}%"
            query = query.filter(
                or_(
                    Offer.title.ilike(keyword_filter),
                    Offer.description.ilike(keyword_filter)
                )
            )
        
        if search_params.offer_type:
            query = query.filter(Offer.offer_type == search_params.offer_type)
        
        if search_params.location:
            query = query.filter(Offer.location.ilike(f"%{search_params.location}%"))
        
        if search_params.location_mode:
            query = query.filter(Offer.location_mode == search_params.location_mode)
        
        if search_params.employment_type:
            query = query.filter(Offer.employment_type == search_params.employment_type)
        
        if search_params.min_salary:
            query = query.filter(Offer.salary_min >= search_params.min_salary)
        
        if search_params.max_salary:
            query = query.filter(Offer.salary_max <= search_params.max_salary)
        
        # Filter by skills
        if search_params.skill_ids:
            from app.models.offer_skill import offer_skill
            query = query.join(offer_skill).filter(
                offer_skill.c.skill_id.in_(search_params.skill_ids)
            )
        
        # Filter by specialities
        if search_params.speciality_ids:
            from app.models.offer_speciality import offer_speciality
            query = query.join(offer_speciality).filter(
                offer_speciality.c.speciality_id.in_(search_params.speciality_ids)
            )
        
        # Get total count
        total = query.count()
        
        # Apply pagination and ordering
        offers = query.order_by(Offer.created_at.desc()).offset(
            (search_params.page - 1) * search_params.page_size
        ).limit(search_params.page_size).all()
        
        return offers, total
    
    
    @staticmethod
    def get_matched_offers_for_student(db: Session, student_id: int, limit: int = 10) -> List[Offer]:
        """Get offers that match student's speciality (for homepage priority)"""
        
        student = db.query(Student).filter(Student.student_id == student_id).first()
        if not student or not student.speciality_id:
            return []
        
        from app.models.offer_speciality import offer_speciality
        
        matched_offers = db.query(Offer).options(
            joinedload(Offer.company)
        ).join(offer_speciality).filter(
            Offer.is_active == True,
            Offer.visibility == True,
            or_(
                Offer.expiration_date == None,
                Offer.expiration_date >= date.today()
            ),
            offer_speciality.c.speciality_id == student.speciality_id
        ).order_by(Offer.created_at.desc()).limit(limit).all()
        
        return matched_offers
    
    
    @staticmethod
    def increment_offer_views(db: Session, offer_id: int):
        """Increment the view count for an offer"""
        offer = db.query(Offer).filter(Offer.offer_id == offer_id).first()
        if offer:
            offer.increment_views()
            db.commit()
    
    
    @staticmethod
    def get_offer_statistics(db: Session, company_id: int) -> OfferStatistics:
        """Get statistics for a company's offers"""
        
        offers = db.query(Offer).filter(Offer.company_id == company_id).all()
        
        active_offers = [o for o in offers if o.is_active]
        expired_offers = [o for o in offers if o.is_expired()]
        
        offers_by_type = {}
        for offer in offers:
            offers_by_type[offer.offer_type] = offers_by_type.get(offer.offer_type, 0) + 1
        
        return OfferStatistics(
            total_offers=len(offers),
            active_offers=len(active_offers),
            expired_offers=len(expired_offers),
            total_views=sum(o.views_count for o in offers),
            total_applications=sum(o.applications_count for o in offers),
            offers_by_type=offers_by_type
        )
@staticmethod
def get_all_offers(
    db: Session,
    page: int = 1,
    page_size: int = 10,
    include_inactive: bool = False,
    include_expired: bool = False
) -> tuple[List[Offer], int]:
    """
    Get all offers with optional filters
    """
    from datetime import date
    
    query = db.query(Offer).options(
        joinedload(Offer.company),
        joinedload(Offer.required_skills),
        joinedload(Offer.required_specialities)
    )
    
    # Filter active offers only
    if not include_inactive:
        query = query.filter(Offer.is_active == True, Offer.visibility == True)
    
    # Filter expired offers
    if not include_expired:
        query = query.filter(
            or_(
                Offer.expiration_date == None,
                Offer.expiration_date >= date.today()
            )
        )
    
    # Get total count
    total = query.count()
    
    # Apply pagination and order by newest first
    offers = query.order_by(Offer.created_at.desc()).offset(
        (page - 1) * page_size
    ).limit(page_size).all()
    
    return offers, total
from sqlalchemy.orm import Session
from sqlalchemy import and_
from fastapi import HTTPException, status, UploadFile
from typing import List, Dict, Optional
from datetime import date

from app.models import Student, Education, Skill, StudentSkill, Offer, Application, OfferEstablishment, Establishment, Speciality
from app.utils.storage import upload_student_profile


class StudentService:

    @staticmethod
    def get_profile(db: Session, student_id: int) -> Dict:
        student = db.query(Student).filter(Student.student_id == student_id).first()
        
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found"
            )
        
        educations = []
        try:
            educations = db.query(Education).filter(
                Education.student_id == student_id
            ).order_by(Education.start_date.desc()).all()
        except Exception:
            # If education table doesn't exist or query fails, return empty list
            pass

        establishment = []
        try:
            current_establishment = db.query(Establishment).filter(
                Establishment.establishment_id == student.establishment_id
            ).first()
        except Exception:
            pass
        
        # handle empty case
        skills_list = []
        try:
            student_skills = db.query(StudentSkill, Skill).join(
                Skill, StudentSkill.skill_id == Skill.skill_id
            ).filter(
                StudentSkill.student_id == student_id
            ).all()
            
            skills_list = [
                {
                    "skill_id": skill.skill_id,
                    "name": skill.name,
                    "category": skill.category,
                    "proficiency_level": student_skill.proficiency_level
                }
                for student_skill, skill in student_skills
            ]
        except Exception:
            pass
    
        return {
            "profile": student,
            "current_establishment": current_establishment,
            "educations": educations or [],
            "skills": skills_list or []    
        }
        
        
    
    @staticmethod
    def update_profile(
        db: Session,
        student_id: int,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        phone: Optional[str] = None,
        bio: Optional[str] = None,
        portfolio_url: Optional[str] = None,
        github_url: Optional[str] = None,
        linkedin_url: Optional[str] = None,
        speciality_id: Optional[int] = None
    ) -> Student:
        """Update student personal information"""
        student = db.query(Student).filter(Student.student_id == student_id).first()
        
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found"
            )
        
        if speciality_id is not None:
            speciality = db.query(Speciality).filter(
                Speciality.speciality_id == speciality_id
            ).first()
            
            if not speciality:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid speciality ID: {speciality_id}"
                )
        
        if first_name is not None:
            student.first_name = first_name
        if last_name is not None:
            student.last_name = last_name
        if phone is not None:
            student.phone = phone
        if bio is not None:
            student.bio = bio
        if portfolio_url is not None:
            student.portfolio_url = portfolio_url
        if github_url is not None:
            student.github_url = github_url
        if linkedin_url is not None:
            student.linkedin_url = linkedin_url
        if speciality_id is not None:
            student.speciality_id = speciality_id
        
        db.commit()
        db.refresh(student)
        return student
    
    @staticmethod
    async def upload_profile_picture(
        db: Session,
        student_id: int,
        file: UploadFile
    ) -> Student:
        student = db.query(Student).filter(Student.student_id == student_id).first()
        
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found"
            )
        
        # Upload to Cloudinary
        profile_pic_url = await upload_student_profile(file, student_id)
        student.profile_pic = profile_pic_url
        
        db.commit()
        db.refresh(student)
        return student
    
    @staticmethod
    def toggle_cv_visibility(db: Session, student_id: int, visibility: bool) -> Student:
        student = db.query(Student).filter(Student.student_id == student_id).first()
        
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found"
            )
        
        student.cv_visibility = visibility
        db.commit()
        db.refresh(student)
        return student
    
    
    @staticmethod
    def add_education(
        db: Session,
        student_id: int,
        degree: str,
        institution: str,
        field_of_study: Optional[str] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        is_current: bool = False
    ) -> Education:
        """Add education record to student profile"""
        new_education = Education(
            student_id=student_id,
            degree=degree,
            institution=institution,
            field_of_study=field_of_study,
            start_date=start_date,
            end_date=end_date,
            is_current=is_current
        )
        
        db.add(new_education)
        db.commit()
        db.refresh(new_education)
        return new_education
    
    @staticmethod
    def update_education(
        db: Session,
        student_id: int,
        education_id: int,
        degree: Optional[str] = None,
        institution: Optional[str] = None,
        field_of_study: Optional[str] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        is_current: Optional[bool] = None
    ) -> Education:
        education = db.query(Education).filter(
            and_(
                Education.education_id == education_id,
                Education.student_id == student_id
            )
        ).first()
        
        if not education:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Education record not found or does not belong to this student"
            )
        
        if degree is not None:
            education.degree = degree
        if institution is not None:
            education.institution = institution
        if field_of_study is not None:
            education.field_of_study = field_of_study
        if start_date is not None:
            education.start_date = start_date
        if end_date is not None:
            education.end_date = end_date
        if is_current is not None:
            education.is_current = is_current
        
        db.commit()
        db.refresh(education)
        return education
    
    @staticmethod
    def delete_education(db: Session, student_id: int, education_id: int) -> Dict[str, str]:
        """Delete an education record"""
        education = db.query(Education).filter(
            and_(
                Education.education_id == education_id,
                Education.student_id == student_id
            )
        ).first()
        
        if not education:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Education record not found"
            )
        
        db.delete(education)
        db.commit()
        return {"message": "Education deleted successfully"}
    
    
    @staticmethod
    def add_skill(
        db: Session,
        student_id: int,
        skill_id: Optional[int] = None,
        skill_ids: Optional[List[int]] = None,
        proficiency_level: Optional[str] = None,
        proficiency_levels: Optional[Dict[int, str]] = None
    ) -> Dict:
        
        # Determine which mode: single or multiple
        if skill_id is not None:
            skills_to_add = [skill_id]
            proficiency_map = {skill_id: proficiency_level} if proficiency_level else {}
        elif skill_ids is not None and len(skill_ids) > 0:
            skills_to_add = skill_ids
            proficiency_map = proficiency_levels or {}
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Must provide either skill_id or skill_ids"
            )
        
        added_skills = []
        errors = []
        
        for sid in skills_to_add:
            try:
                # Check if skill exists
                skill = db.query(Skill).filter(Skill.skill_id == sid).first()
                if not skill:
                    errors.append({
                        "skill_id": sid,
                        "error": "Skill not found"
                    })
                    continue
                
                # Check if already added
                existing = db.query(StudentSkill).filter(
                    and_(
                        StudentSkill.student_id == student_id,
                        StudentSkill.skill_id == sid
                    )
                ).first()
                
                if existing:
                    errors.append({
                        "skill_id": sid,
                        "error": "Skill already added"
                    })
                    continue
                
                # Add skill
                prof_level = proficiency_map.get(sid)
                student_skill = StudentSkill(
                    student_id=student_id,
                    skill_id=sid,
                    proficiency_level=prof_level
                )
                
                db.add(student_skill)
                
                added_skills.append({
                    "skill_id": skill.skill_id,
                    "name": skill.name,
                    "category": skill.category,
                    "proficiency_level": prof_level
                })
                
            except Exception as e:
                errors.append({
                    "skill_id": sid,
                    "error": str(e)
                })
        
        # Commit all successful additions
        if added_skills:
            db.commit()
        
        result = {"added": added_skills}
        if errors:
            result["errors"] = errors
        
        return result
    
    @staticmethod
    def remove_skill(db: Session, student_id: int, skill_id: int) -> Dict[str, str]:
        """Remove skill from student profile"""
        student_skill = db.query(StudentSkill).filter(
            and_(
                StudentSkill.student_id == student_id,
                StudentSkill.skill_id == skill_id
            )
        ).first()
        
        if not student_skill:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Skill not found in student profile"
            )
        
        db.delete(student_skill)
        db.commit()
        return {"message": "Skill removed successfully"}
    
    
    @staticmethod
    def get_all_offers(
        db: Session,
        student_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[Offer]:
        """
        Get offers visible to student:
        1. Offers with visibility=True (public to all)
        2. Offers with visibility=False BUT targeted to student's establishment
        """
        # Get student's establishment
        student = db.query(Student).filter(Student.student_id == student_id).first()
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found"
            )
        
        from sqlalchemy import or_
        
        # Get all active offers
        # Then filter by visibility logic
        query = db.query(Offer).filter(Offer.is_active == True)
        
        # If visibility=True: show to everyone
        # If visibility=False: only show if offer is targeted to student's establishment
        
        # Subquery: get offer_ids targeted to student's establishment
        targeted_offer_ids = db.query(OfferEstablishment.offer_id).filter(
            OfferEstablishment.establishment_id == student.establishment_id
        ).subquery()
        
        # Apply visibility filter
        query = query.filter(
            or_(
                Offer.visibility == True,  # Public offers
                and_(
                    Offer.visibility == False,  # Private offers
                    Offer.offer_id.in_(targeted_offer_ids)  # Targeted to student's establishment
                )
            )
        )
        
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def get_offer_details(db: Session, student_id: int, offer_id: int) -> Offer:
        """Get single offer details (if student has access to it)"""
        student = db.query(Student).filter(Student.student_id == student_id).first()
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found"
            )
        
        from sqlalchemy import or_
        
        # Check if offer is targeted to student's establishment
        is_targeted = db.query(OfferEstablishment).filter(
            and_(
                OfferEstablishment.offer_id == offer_id,
                OfferEstablishment.establishment_id == student.establishment_id
            )
        ).first() is not None
        
        # Get offer with visibility check
        offer = db.query(Offer).filter(
            and_(
                Offer.offer_id == offer_id,
                Offer.is_active == True,
                or_(
                    Offer.visibility == True,  # Public
                    and_(
                        Offer.visibility == False,  # Private
                        is_targeted  # But targeted to student's establishment
                    )
                )
            )
        ).first()
        
        if not offer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Offer not found or you don't have access to it"
            )
        
        return offer
    
    
    @staticmethod
    def apply_to_offer(db: Session, student_id: int, offer_id: int) -> Application:
        """Apply to an offer (one-click application)"""
        # Get student
        student = db.query(Student).filter(Student.student_id == student_id).first()
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found"
            )
        
        from sqlalchemy import or_
        
        # Check if offer is targeted to student's establishment
        is_targeted = db.query(OfferEstablishment).filter(
            and_(
                OfferEstablishment.offer_id == offer_id,
                OfferEstablishment.establishment_id == student.establishment_id
            )
        ).first() is not None
        
        # Check if offer exists and student has access to it
        offer = db.query(Offer).filter(
            and_(
                Offer.offer_id == offer_id,
                Offer.is_active == True,
                or_(
                    Offer.visibility == True,
                    and_(
                        Offer.visibility == False,
                        is_targeted
                    )
                )
            )
        ).first()
        
        if not offer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Offer not found or not available"
            )
        
        # Check if already applied
        existing = db.query(Application).filter(
            and_(
                Application.offer_id == offer_id,
                Application.student_id == student_id
            )
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already applied to this offer"
            )
        
        # Create application
        application = Application(
            offer_id=offer_id,
            student_id=student_id,
            status='received'  # Initial status
        )
        
        db.add(application)
        db.commit()
        db.refresh(application)
        return application
    
    @staticmethod
    def get_my_applications(db: Session, student_id: int) -> List[Application]:
        """Get all applications submitted by student"""
        return db.query(Application).filter(
            Application.student_id == student_id
        ).all()
    
    @staticmethod
    def withdraw_application(db: Session, student_id: int, application_id: int) -> Dict[str, str]:
        """Withdraw an application (only if status is 'received')"""
        application = db.query(Application).filter(
            and_(
                Application.application_id == application_id,
                Application.student_id == student_id
            )
        ).first()
        
        if not application:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application not found"
            )
        
        # Can only withdraw if not yet processed
        if application.status != 'received':
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot withdraw application with status '{application.status}'"
            )
        
        db.delete(application)
        db.commit()
        return {"message": "Application withdrawn successfully"}
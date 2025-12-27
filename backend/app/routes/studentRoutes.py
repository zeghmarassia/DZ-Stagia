from fastapi import APIRouter, Depends, HTTPException, UploadFile, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.schemas.student import (
    StudentUpdateProfile, StudentProfileResponse, StudentResponse, 
    EducationResponse, CVVisibilityToggle, AddEducationRequest, 
    UpdateEducationRequest, AddExperienceRequest, 
    UpdateExperienceRequest, ExperienceResponse,AddSkillsRequest, OfferResponse, 
    ApplicationResponse, MessageResponse, AddSkillsResponse, OffersListResponse,
    ApplicationsListResponse
)
from app.schemas.helper import (
    DomainResponse, SpecialityResponse, SkillListResponse
)
from app.services.studentService import StudentService
from app.services.helperService import HelpersService
from app.utils.security import get_current_student

router = APIRouter(prefix="/student", tags=["Students"])


# Helper endpoints
@router.get("/domains", response_model=List[DomainResponse])
def get_all_domains(db: Session = Depends(get_db)):
    return HelpersService.get_all_domains(db)

@router.get("/domains/{domain_id}/specialities", response_model=List[SpecialityResponse])
def get_specialities_by_domain(domain_id: int, db: Session = Depends(get_db)):
    return HelpersService.get_specialities_by_domain(db, domain_id)

@router.get("/skills", response_model=List[SkillListResponse])
def get_all_skills(db: Session = Depends(get_db)):
    return HelpersService.get_all_skills(db)


# Profile endpoints
@router.get("/profile", response_model=StudentProfileResponse)
def get_student_profile(
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    return StudentService.get_profile(db, current_student["user_id"])

@router.put("/profile", response_model=StudentResponse)
def update_student_profile(
    profile_data: StudentUpdateProfile,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    return StudentService.update_profile(
        db=db,
        student_id=current_student["user_id"],
        **profile_data.dict(exclude_unset=True)
    )

@router.post("/profile-picture", response_model=StudentResponse)
async def upload_profile_picture(
    file: UploadFile,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    return await StudentService.upload_profile_picture(db, current_student["user_id"], file)

@router.put("/cv-visibility", response_model=StudentResponse)
def toggle_cv_visibility(
    visibility_data: CVVisibilityToggle,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    return StudentService.toggle_cv_visibility(db, current_student["user_id"], visibility_data.visibility)


# Education endpoints
@router.post("/educations", response_model=EducationResponse)
def add_education(
    education_data: AddEducationRequest,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    return StudentService.add_education(
        db=db,
        student_id=current_student["user_id"],
        **education_data.dict()
    )

@router.put("/educations/{education_id}", response_model=EducationResponse)
def update_education(
    education_id: int,
    education_data: UpdateEducationRequest,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    return StudentService.update_education(
        db=db,
        student_id=current_student["user_id"],
        education_id=education_id,
        **education_data.dict(exclude_unset=True)
    )

@router.delete("/educations/{education_id}", response_model=MessageResponse)
def delete_education(
    education_id: int,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    return StudentService.delete_education(db, current_student["user_id"], education_id)

#Experience endpoints
@router.post("/experience", response_model=ExperienceResponse)
def add_experience(
    experience_data: AddExperienceRequest,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Add work experience to profile"""
    student_id = current_student["user_id"]
    return StudentService.add_experience(
        db=db,
        student_id=student_id,
        **experience_data.dict()
    )


@router.put("/experience/{experience_id}", response_model=ExperienceResponse)
def update_experience(
    experience_id: int,
    experience_data: UpdateExperienceRequest,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Update an experience record"""
    student_id = current_student["user_id"]
    return StudentService.update_experience(
        db=db,
        student_id=student_id,
        experience_id=experience_id,
        **experience_data.dict(exclude_unset=True)
    )


@router.delete("/experience/{experience_id}", response_model=MessageResponse)
def delete_experience(
    experience_id: int,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Delete an experience record"""
    student_id = current_student["user_id"]
    return StudentService.delete_experience(db, student_id, experience_id)


# Skill endpoints
@router.post("/skills", response_model= AddSkillsResponse)
def add_skills(
    skill_data: AddSkillsRequest,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    # Transform SkillInput list to skill_ids and proficiency_levels dict
    skill_ids = [skill.skill_id for skill in skill_data.skills]
    proficiency_levels = {
        skill.skill_id: skill.proficiency_level 
        for skill in skill_data.skills 
        if skill.proficiency_level is not None
    }
    
    return StudentService.add_skill(
        db=db,
        student_id=current_student["user_id"],
        skill_ids=skill_ids,
        proficiency_levels=proficiency_levels if proficiency_levels else None
    )

@router.delete("/skills/{skill_id}", response_model=MessageResponse)
def remove_skill(
    skill_id: int,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    return StudentService.remove_skill(db, current_student["user_id"], skill_id)


# Offer endpoints
@router.get("/offers", response_model=OffersListResponse)
def get_all_offers(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    search: Optional[str] = Query(None),
    offer_type: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    return StudentService.get_all_offers(
        db, current_student["user_id"], skip, limit
    )
    # Note: You'll need to update StudentService.get_all_offers 
    # to accept search, offer_type, location parameters

@router.get("/offers/{offer_id}", response_model=OfferResponse)
def get_offer_details(
    offer_id: int,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    return StudentService.get_offer_details(db, current_student["user_id"], offer_id)

@router.post("/offers/{offer_id}/apply", response_model=ApplicationResponse)
def apply_to_offer(
    offer_id: int,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    return StudentService.apply_to_offer(db, current_student["user_id"], offer_id)


# Application endpoints
@router.get("/applications", response_model=ApplicationsListResponse)
def get_my_applications(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    return StudentService.get_my_applications(db, current_student["user_id"], skip, limit)

@router.delete("/applications/{application_id}", response_model=MessageResponse)
def withdraw_application(
    application_id: int,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    return StudentService.withdraw_application(db, current_student["user_id"], application_id)
# app/routes/student_routes.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, Query
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.student import (
    StudentUpdateProfile, StudentProfileResponse, StudentResponse, 
    EducationResponse, CVVisibilityToggle, AddEducationRequest, 
    UpdateEducationRequest, AddSkillRequest, SkillListResponse,
    DomainResponse, SpecialityResponse, OfferResponse, 
    ApplicationResponse, MessageResponse
)
from app.services.studentService import StudentService
from app.utils.security import get_current_student

router = APIRouter(prefix="/students", tags=["Students"])


@router.get("/domains", response_model=List[DomainResponse])
def get_all_domains(db: Session = Depends(get_db)):
    """Get all domains for dropdown selection"""
    return StudentService.get_all_domains(db)

@router.get("/domains/{domain_id}/specialities", response_model=List[SpecialityResponse])
def get_specialities_by_domain(domain_id: int, db: Session = Depends(get_db)):
    """Get all specialities for a specific domain"""
    return StudentService.get_specialities_by_domain(db, domain_id)

@router.get("/skills", response_model=List[SkillListResponse])
def get_all_skills(db: Session = Depends(get_db)):
    """Get all available skills for dropdown selection"""
    return StudentService.get_all_skills(db)



@router.get("/{student_id}/profile", response_model=StudentProfileResponse)
def get_student_profile(
    student_id: int, 
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Get complete student profile with education and skills"""
    if student_id != current_student["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return StudentService.get_profile(db, student_id)

@router.put("/{student_id}/profile", response_model=StudentResponse)
def update_student_profile(
    student_id: int,
    profile_data: StudentUpdateProfile,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Update student personal information"""
    if student_id != current_student["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return StudentService.update_profile(
        db=db,
        student_id=student_id,
        first_name=profile_data.first_name,
        last_name=profile_data.last_name,
        phone=profile_data.phone,
        bio=profile_data.bio,
        portfolio_url=profile_data.portfolio_url,
        github_url=profile_data.github_url,
        linkedin_url=profile_data.linkedin_url,
        speciality_id=profile_data.speciality_id
    )

@router.post("/{student_id}/profile-picture", response_model=StudentResponse)
async def upload_profile_picture(
    student_id: int,
    file: UploadFile,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Upload student profile picture"""
    if student_id != current_student["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return await StudentService.upload_profile_picture(db, student_id, file)

@router.put("/{student_id}/cv-visibility", response_model=StudentResponse)
def toggle_cv_visibility(
    student_id: int,
    visibility_data: CVVisibilityToggle,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Toggle CV visibility (public/private)"""
    if student_id != current_student["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return StudentService.toggle_cv_visibility(db, student_id, visibility_data.visibility)


@router.post("/{student_id}/educations", response_model=EducationResponse)
def add_education(
    student_id: int,
    education_data: AddEducationRequest,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Add education record to student profile"""
    if student_id != current_student["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return StudentService.add_education(
        db=db,
        student_id=student_id,
        degree=education_data.degree,
        institution=education_data.institution,
        field_of_study=education_data.field_of_study,
        start_date=education_data.start_date,
        end_date=education_data.end_date,
        is_current=education_data.is_current
    )

@router.put("/{student_id}/educations/{education_id}", response_model=EducationResponse)
def update_education(
    student_id: int,
    education_id: int,
    education_data: UpdateEducationRequest,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Update an education record"""
    if student_id != current_student["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return StudentService.update_education(
        db=db,
        student_id=student_id,
        education_id=education_id,
        degree=education_data.degree,
        institution=education_data.institution,
        field_of_study=education_data.field_of_study,
        start_date=education_data.start_date,
        end_date=education_data.end_date,
        is_current=education_data.is_current
    )

@router.delete("/{student_id}/educations/{education_id}", response_model=MessageResponse)
def delete_education(
    student_id: int,
    education_id: int,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Delete an education record"""
    if student_id != current_student["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return StudentService.delete_education(db, student_id, education_id)


@router.post("/{student_id}/skills", response_model=dict)
def add_skill(
    student_id: int,
    skill_data: AddSkillRequest,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Add skill to student profile"""
    if student_id != current_student["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return StudentService.add_skill(
        db=db,
        student_id=student_id,
        skill_id=skill_data.skill_id,
        proficiency_level=skill_data.proficiency_level
    )

@router.delete("/{student_id}/skills/{skill_id}", response_model=MessageResponse)
def remove_skill(
    student_id: int,
    skill_id: int,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Remove skill from student profile"""
    if student_id != current_student["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return StudentService.remove_skill(db, student_id, skill_id)


@router.get("/{student_id}/offers", response_model=List[OfferResponse])
def get_all_offers(
    student_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Get offers visible to student"""
    if student_id != current_student["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return StudentService.get_all_offers(db, student_id, skip, limit)

@router.get("/{student_id}/offers/{offer_id}", response_model=OfferResponse)
def get_offer_details(
    student_id: int,
    offer_id: int,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Get single offer details (if student has access to it)"""
    if student_id != current_student["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return StudentService.get_offer_details(db, student_id, offer_id)

@router.post("/{student_id}/offers/{offer_id}/apply", response_model=ApplicationResponse)
def apply_to_offer(
    student_id: int,
    offer_id: int,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Apply to an offer (one-click application)"""
    if student_id != current_student["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return StudentService.apply_to_offer(db, student_id, offer_id)

@router.get("/{student_id}/applications", response_model=List[ApplicationResponse])
def get_my_applications(
    student_id: int,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Get all applications submitted by student"""
    if student_id != current_student["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return StudentService.get_my_applications(db, student_id)

@router.delete("/{student_id}/applications/{application_id}", response_model=MessageResponse)
def withdraw_application(
    student_id: int,
    application_id: int,
    current_student: dict = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Withdraw an application (only if status is 'received')"""
    if student_id != current_student["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return StudentService.withdraw_application(db, student_id, application_id)
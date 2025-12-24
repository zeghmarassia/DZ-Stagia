from .auth import (
    Token,
    TokenData,
    LoginRequest,
    LoginResponse,
    StudentRegister,
    StudentResponse,
    CompanyRegister,
    CompanyResponse,
    AdminResponse,
    OTPRequest,
    OTPVerify,
    OTPVerifyWithEmail,
)

from .admin import (
    StudentListResponse,
    CompanyListResponse,
    OfferListResponse,
    UserStatsCategory,
    OfferStats,
    StatisticsResponse,
    AdminListResponse,
)

from .student import (
    StudentUpdateProfile,
    CVVisibilityToggle,
    AddEducationRequest,
    UpdateEducationRequest,
    SkillInput,
    AddSkillsRequest,
    SkillError,
    AddSkillsResponse,
    AddExperienceRequest,
    UpdateExperienceRequest,
    ExperienceResponse,
    EducationResponse,
    SkillResponse,
    StudentProfileResponse,
    OfferResponse,
    OffersListResponse,
    ApplicationResponse,
    ApplicationsListResponse,
    MessageResponse,
)

from .helper import (
    EstablishmentResponse,
    DomainResponse,
    SpecialityResponse,
    SkillListResponse,
)

__all__ = [
    # Auth schemas
    "Token",
    "TokenData",
    "LoginRequest",
    "LoginResponse",
    "StudentRegister",
    "StudentResponse",
    "CompanyRegister",
    "CompanyResponse",
    "AdminResponse",
    "OTPRequest",
    "OTPVerify",
    "OTPVerifyWithEmail",
    
    # Admin schemas
    "StudentListResponse",
    "CompanyListResponse",
    "OfferListResponse",
    "UserStatsCategory",
    "OfferStats",
    "StatisticsResponse",
    "AdminListResponse",
    
    # Student schemas
    "StudentUpdateProfile",
    "CVVisibilityToggle",
    "AddEducationRequest",
    "UpdateEducationRequest",
    "SkillInput",
    "AddSkillsRequest",
    "SkillError",
    "AddSkillsResponse",
    "AddExperienceRequest",      
    "UpdateExperienceRequest",   
    "ExperienceResponse",        
    "EducationResponse",
    "SkillResponse",
    "StudentProfileResponse",
    "OfferResponse",
    "OffersListResponse",
    "ApplicationResponse",
    "ApplicationsListResponse",
    "MessageResponse",
    
    # Helper schemas
    "EstablishmentResponse",
    "DomainResponse",
    "SpecialityResponse",
    "SkillListResponse",
]
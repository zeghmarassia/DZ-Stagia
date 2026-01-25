from app.database import Base

from app.models.domain import Domain
from app.models.speciality import Speciality
from app.models.establishment import Establishment
from app.models.student import Student
from app.models.company import Company
from app.models.admin import Admin
from app.models.otp import OTP
from app.models.skill import Skill
from app.models.offer import Offer
from app.models.application import Application
from app.models.education import Education
from app.models.experience import Experience
from app.models.notification import Notification
from .speciality import Speciality
from .offer_speciality import offer_speciality
# Junction tables
from app.models.student_skill import StudentSkill
from app.models.offer_skill import OfferSkill
from app.models.offer_establishment import OfferEstablishment

# Export all
__all__ = [
    "Base",
    "Domain",
    "Speciality",
    "Establishment",
    "Student",
    "Company",
    "Admin",
    "OTP",
    "Skill",
    "Offer",
    "Application",
    "Education",
    "Experience",
    "StudentSkill",
    "OfferSkill",
    "OfferEstablishment",
    "Notification"
]
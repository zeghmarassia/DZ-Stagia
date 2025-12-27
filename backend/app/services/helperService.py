from sqlalchemy.orm import Session
from typing import List

from app.models import Establishment, Domain, Speciality, Skill


class HelpersService:
    
    @staticmethod
    def get_all_establishments(db: Session) -> List[Establishment]:
        return db.query(Establishment).all()
    
    @staticmethod
    def get_all_domains(db: Session) -> List[Domain]:
        return db.query(Domain).all()
    
    @staticmethod
    def get_specialities_by_domain(db: Session, domain_id: int) -> List[Speciality]:
        return db.query(Speciality).filter(
            Speciality.domain_id == domain_id
        ).all()
    
    @staticmethod
    def get_all_specialities(db: Session) -> List[Speciality]:
        return db.query(Speciality).all()
    
    @staticmethod
    def get_all_skills(db: Session) -> List[Skill]:
        return db.query(Skill).all()
    
    @staticmethod
    def get_skills_by_category(db: Session, category: str) -> List[Skill]:
        return db.query(Skill).filter(Skill.category == category).all()
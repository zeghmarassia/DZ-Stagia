# get list of establishments in our db for student registration
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.establishment import Establishment

router = APIRouter(prefix="/establishments", tags=["establishments"])

@router.get("/list")
def get_establishments(db: Session = Depends(get_db)):
    establishments = db.query(Establishment).all()
    
    return [
        {
            "establishment_id": est.establishment_id,
            "name": est.name
        }
        for est in establishments
    ]
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.schemas.app_entry import AppCreate, AppOut
from app.crud.app_entry import get_all_apps, create_app_entry
from typing import List

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[AppOut])
def list_apps(db: Session = Depends(get_db)):
    return get_all_apps(db)

@router.post("/", response_model=AppOut)
def add_app(app_data: AppCreate, db: Session = Depends(get_db)):
    return create_app_entry(db, app_data)

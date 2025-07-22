from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.schemas.app_entry import AppCreate, AppOut
from app.crud.app_entry import create_app_entry, get_app_by_id, delete_app, update_app
from app.core.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.app_entry import AppEntry
from typing import List

router = APIRouter()

@router.get("/", response_model=dict)
@router.get("/", response_model=dict)
def list_apps(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    limit: int = Query(10, ge=1),
    skip: int = Query(0, ge=0),
    search: str = Query("", alias="search")
):
    query = db.query(AppEntry)
    if search:
        query = query.filter(AppEntry.name.ilike(f"%{search}%"))
    total = query.count()
    apps = query.offset(skip).limit(limit).all()
    # Convert each SQLAlchemy object to Pydantic model
    items = [AppOut.model_validate(app) for app in apps]
    return {"items": items, "total": total}

@router.get("/{app_id}", response_model=AppOut)
def list_app_by_id(app_id: int, db: Session = Depends(get_db)):
    app = get_app_by_id(db, app_id)
    if not app:
        raise HTTPException(status_code=404, detail="App not found")
    return app

@router.post("/", response_model=AppOut)
def add_app(app_data: AppCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return create_app_entry(db, app_data, user.id)

@router.put("/{app_id}", response_model=AppOut)
def update_app_entry(app_id: int, app_data: AppCreate, db: Session = Depends(get_db)):
    app = get_app_by_id(db, app_id)
    if not app:
        raise HTTPException(status_code=404, detail="App not found")
    return update_app(db, app_id, app_data)

@router.delete("/{app_id}")
def delete_app_entry(app_id: int, db: Session = Depends(get_db)):
    app = get_app_by_id(db, app_id)
    if not app:
        raise HTTPException(status_code=404, detail="App not found")
    return delete_app(db, app_id)
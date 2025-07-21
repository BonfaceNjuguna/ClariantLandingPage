from sqlalchemy.orm import Session
from app.models.app_entry import AppEntry
from app.schemas.app_entry import AppCreate
from fastapi import HTTPException

def get_all_apps(db: Session):
    return db.query(AppEntry).all()

def create_app_entry(db: Session, app_data: AppCreate, user_id: int):
    new_app = AppEntry(
        name=app_data.name,
        owner=app_data.owner,
        description=app_data.description,
        url=app_data.url,
        port=app_data.port,
        status=app_data.status,
        created_by_user_id=user_id
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app

def get_app_by_id(db: Session, app_id: int):
    app = db.query(AppEntry).filter(AppEntry.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App not found")
    return app

def delete_app(db: Session, app_id: int):
    app = db.query(AppEntry).filter(AppEntry.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App not found")
    db.delete(app)
    db.commit()
    return {"detail": "App deleted successfully"}

def update_app(db: Session, app_id: int, app_data: AppCreate):
    app = db.query(AppEntry).filter(AppEntry.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App not found")
    
    for key, value in app_data.dict().items():
        setattr(app, key, value)
    
    db.commit()
    db.refresh(app)
    return app
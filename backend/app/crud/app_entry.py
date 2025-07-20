from sqlalchemy.orm import Session
from app.models.app_entry import AppEntry
from app.schemas.app_entry import AppCreate

def get_all_apps(db: Session):
    return db.query(AppEntry).all()

def create_app_entry(db: Session, app_data: AppCreate):
    app = AppEntry(**app_data.dict())
    db.add(app)
    db.commit()
    db.refresh(app)
    return app

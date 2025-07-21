from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.user import User

def update_last_login(db: Session, user: User):
    user.last_login = datetime.now(timezone.utc)
    db.commit()
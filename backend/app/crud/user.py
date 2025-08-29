from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.user import User

def create_user(db: Session, user_data: dict) -> User:
    new_user = User(
        email=user_data["email"],
        name=user_data.get("name", ""),
        last_login=datetime.now(timezone.utc)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def update_last_login(db: Session, user: User):
    user.last_login = datetime.now(timezone.utc)
    db.commit()
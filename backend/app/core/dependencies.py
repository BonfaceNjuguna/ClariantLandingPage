from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.user import User
from app.core.oauth import verify_google_token
from fastapi.security import OAuth2PasswordBearer

# In real world, you'd use OAuth2 Bearer JWT. For now, we simulate with token param
oauth_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(token: str = Depends(oauth_scheme), db: Session = Depends(get_db)) -> User:
    payload = await verify_google_token(token)
    user = db.query(User).filter(User.email == payload["email"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

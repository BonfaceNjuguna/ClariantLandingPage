from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.user import User
from app.core.oauth import verify_google_token
from fastapi.security import OAuth2PasswordBearer
from app.core.security import decode_jwt_token

# simulate with token param, implement OAuth2 Bearer JWT later
oauth_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(token: str = Depends(oauth_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = await verify_google_token(token)
    except Exception:
        try:
            payload = decode_jwt_token(token)
        except Exception:
            raise HTTPException(status_code=401, detail="Invalid token")
    email = payload.get("sub") or payload.get("email")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

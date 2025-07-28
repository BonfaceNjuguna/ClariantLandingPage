from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.oauth import verify_google_token, verify_microsoft_token
from app.crud.user import update_last_login
from app.core.dependencies import get_db
from app.models.user import User 

router = APIRouter()

class TokenPayload(BaseModel):
    token: str
    provider: str
    
@router.post("/login")
async def login(payload: TokenPayload, db=Depends(get_db)):
    if payload.provider == "google":
        user_data = await verify_google_token(payload.token)
    elif payload.provider == "microsoft":
        user_data = await verify_microsoft_token(payload.token)
    else:
        return {"error": "Unsupported provider"}
    user = db.query(User).filter(User.email == user_data["email"]).first()
    if user:
        update_last_login(db, user)
    return {"message": "Login successful", "user": user_data}

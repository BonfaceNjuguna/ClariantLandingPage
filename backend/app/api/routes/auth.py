from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.oauth import verify_microsoft_token
from app.crud.user import update_last_login, create_user
from app.core.dependencies import get_db
from app.models.user import User 
from app.core.security import create_jwt_token

router = APIRouter()

class TokenPayload(BaseModel):
    token: str
    
@router.post("/login")
async def login(payload: TokenPayload, db=Depends(get_db)):
    user_data = await verify_microsoft_token(payload.token)
    
    user = db.query(User).filter(User.email == user_data["email"]).first()
    
    if user:
        update_last_login(db, user)
    else:
        user = create_user(db, user_data)
        
    # Generate our own JWT
    jwt_token = create_jwt_token(user_data["email"])
    
    return {"message": "Login successful", "user": user_data, "access_token": jwt_token}

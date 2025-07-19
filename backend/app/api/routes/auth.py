from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.oauth import verify_google_token

router = APIRouter()

class TokenPayload(BaseModel):
    token: str

@router.post("/login")
async def login(payload: TokenPayload):
    user_data = await verify_google_token(payload.token)
    return {"message": "Login successful", "user": user_data}

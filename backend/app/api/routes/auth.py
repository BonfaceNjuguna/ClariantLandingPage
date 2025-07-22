from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.schemas.auth import SendOtpPayload, VerifyOtpPayload
from app.services.auth_service import handle_send_otp, handle_verify_otp

router = APIRouter()

@router.post("/send-otp")
def send_otp(payload: SendOtpPayload, db: Session = Depends(get_db)):
    return handle_send_otp(payload, db)

@router.post("/verify-otp")
def verify_otp(payload: VerifyOtpPayload, db: Session = Depends(get_db)):
    return handle_verify_otp(payload, db)

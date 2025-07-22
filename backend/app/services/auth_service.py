from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
from sqlalchemy import and_
from app.models.user import User
from app.models.otp import OtpCode
from app.core.config import settings
from app.core.security import create_jwt_token
from app.utils.mailer import send_email
import secrets


def handle_send_otp(payload, db: Session):
    email = payload.email.lower()
    if not (email.endswith("@clariant.com") or email == settings.WHITELISTED_EMAIL):
        raise HTTPException(status_code=403, detail="Unauthorized email domain")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(email=email, name=email.split("@")[0])
        db.add(user)
        db.commit()
        db.refresh(user)

    otp = f"{secrets.randbelow(1000000):06d}"
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

    existing = db.query(OtpCode).filter(OtpCode.email == email).first()
    if existing:
        existing.code = otp
        existing.expires_at = expires_at
    else:
        db.add(OtpCode(email=email, code=otp, expires_at=expires_at))
    db.commit()

    send_email(email, otp)
    return {"message": "OTP sent"}

def handle_verify_otp(payload, db: Session):
    email = payload.email.lower()
    otp = payload.otp.strip()
    record = db.query(OtpCode).filter(and_(OtpCode.email == email, OtpCode.code == otp)).first()
    if not record:
        raise HTTPException(status_code=401, detail="Invalid or expired OTP")

    # Ensure expires_at is timezone-aware
    expires_at = record.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Invalid or expired OTP")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.last_login = datetime.now(timezone.utc)
    db.commit()

    db.delete(record)
    db.commit()

    token = create_jwt_token(user.email)
    return {
        "user": {"email": user.email, "name": user.name},
        "token": token
    }
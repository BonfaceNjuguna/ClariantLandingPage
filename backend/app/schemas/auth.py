from pydantic import BaseModel, EmailStr

class SendOtpPayload(BaseModel):
    email: EmailStr

class VerifyOtpPayload(BaseModel):
    email: EmailStr
    otp: str
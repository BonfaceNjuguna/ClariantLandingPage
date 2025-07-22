from sqlalchemy import Column, String, DateTime
from app.core.database import Base

class OtpCode(Base):
    __tablename__ = "otp_codes"
    email = Column(String, primary_key=True)
    code = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)

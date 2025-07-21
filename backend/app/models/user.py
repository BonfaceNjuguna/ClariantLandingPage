from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String)
    last_login = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)


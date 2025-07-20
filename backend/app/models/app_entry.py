from sqlalchemy import Column, Integer, String
from app.core.database import Base

class AppEntry(Base):
    __tablename__ = "apps"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    owner = Column(String, nullable=False)
    description = Column(String, nullable=True)
    url = Column(String, nullable=True)
    port = Column(Integer, nullable=False)
    status = Column(String, nullable=False)  # "Active" or "Inactive"

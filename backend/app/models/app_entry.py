from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class AppEntry(Base):
    __tablename__ = "apps"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    owner = Column(String, nullable=False)
    description = Column(String, nullable=True)
    url = Column(String, nullable=True)
    comment = Column(String, nullable=True)
    status = Column(String, nullable=False)

    created_by_user_id = Column(Integer, ForeignKey("users.id"))
    created_by = relationship("User", backref="apps_created")

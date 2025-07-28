from pydantic import BaseModel
from typing import Optional, Literal

class AppBase(BaseModel):
    name: str
    owner: str
    description: Optional[str] = None
    url: Optional[str] = None
    comment: Optional[str] = None
    status: Literal["Active", "Inactive"]

class AppCreate(AppBase):
    pass

class AppOut(AppBase):
    id: int

    class Config:
        from_attributes = True
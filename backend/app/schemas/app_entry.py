from pydantic import BaseModel
from typing import Optional, Literal
from pydantic import ConfigDict

class AppBase(BaseModel):
    name: str
    owner: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    comment: Optional[str] = None
    status: Literal["Active", "Inactive"]

class AppCreate(AppBase):
    pass

class AppOut(AppBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
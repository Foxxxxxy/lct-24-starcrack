from typing import Optional

from pydantic import BaseModel
from model.enum.enums import RoleType, SexType


class SignUpSchema(BaseModel):
    password: str
    role: RoleType
    sex: SexType
    full_name: str


class UserOutputSchema(BaseModel):
    id: int
    role: RoleType
    full_name: str

    class Config:
        orm_mode = True
        from_attributes = True


class UserUpdateSchema(BaseModel):
    level: Optional[int] = None

    email: Optional[str] = None
    name: Optional[str] = None
    last_name: Optional[str] = None
    organisation_name: Optional[str] = None
    inn: Optional[str] = None
    web_site: Optional[str] = None

    fathers_name: Optional[str] = None
    industry_id: Optional[int] = None
    country: Optional[str] = None
    city: Optional[str] = None
    position: Optional[str] = None

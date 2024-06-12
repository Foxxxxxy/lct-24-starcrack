from datetime import datetime
from typing import Union, Optional

import pydantic

from db.models.requisitions import Status
from model.enum.enums import PassengerCategory, SexType, RoleType, SubRoleType, Weekday


class RequisitionUpdateDTO(pydantic.BaseModel):
    id: int
    passenger_id: Optional[int] = None
    start_time: Optional[datetime] = None
    meet_time: Optional[datetime] = None
    finish_time: Optional[datetime] = None
    status: Optional[Status] = None
    creation_time: Optional[datetime] = None
    males_needed: Optional[int] = None
    females_needed: Optional[int] = None
    start_station: Optional[Union[int, str]] = None
    end_station: Optional[Union[int, str]] = None

    class Config:
        use_enum_values = True


class PassengerUpdateDTO(pydantic.BaseModel):
    id: Optional[int]
    passenger_category: Optional[PassengerCategory] = None
    name: Optional[str] = None
    phone: Optional[str] = None

    class Config:
        use_enum_values = True


class EmployeeUpdateDto(pydantic.BaseModel):
    id: int
    full_name: str
    sex: Optional[SexType]
    role: Optional[RoleType]
    sub_role: Optional[SubRoleType] = None

    class Config:
        use_enum_values = True


class ShiftUpdateDto(pydantic.BaseModel):
    id: int
    employee_id: int
    time_start: Optional[datetime]
    time_end: Optional[datetime]
    place_start: Optional[int]
    weekday: Optional[Weekday]

    class Config:
        use_enum_values = True

import enum
from datetime import datetime, time
from typing import Literal, Union, Optional
from model.enum.enums import *
import pydantic


class ShiftDTO(pydantic.BaseModel):
    employee_id: Optional[int]
    time_start: time
    time_end: time
    place_start: int
    weekday: Weekday

    class Config:
        use_enum_values = True


class PassengerDTO(pydantic.BaseModel):
    id: Optional[int]
    sex: SexType
    passenger_category: PassengerCategory
    name: str
    phone: str
    comment: Optional[str]
    pacemaker: bool

    class Config:
        use_enum_values = True


class RequisitionDTO(pydantic.BaseModel):
    id: Optional[int] = None
    passenger_id: int
    passengers_amount: int
    start_time: datetime
    meet_time: Union[datetime, None]
    finish_time: Optional[datetime] = None
    status: Status
    creation_time: datetime
    males_needed: int
    females_needed: int
    start_station: Union[str, int]
    start_station_comment: Optional[str]
    end_station: Union[str, int]
    end_station_comment: Optional[str]
    method: MethodType
    baggage: Optional[str]
    comment: Optional[str]

    class Config:
        use_enum_values = True


class EmployeeDTO(pydantic.BaseModel):
    id: Optional[int]
    full_name: str
    sex: SexType
    role: RoleType
    sub_role: Union[SubRoleType, None] = None
    phone: str
    easy_work: bool

    class Config:
        use_enum_values = True


import enum
from datetime import datetime
from typing import Literal, Union

import pydantic


class Weekday(enum.Enum):
    Monday = 'Monday'
    Tuesday = 'Tuesday'
    Wednesday = 'Wednesday'
    Thursday = 'Thursday'
    Friday = 'Friday'
    Saturday = 'Saturday'
    Sunday = 'Sunday'


class ShiftDTO(pydantic.BaseModel):
    employee_id: int
    time_start: datetime
    time_end: datetime
    place_start: int
    weekday: Literal['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']


class PassengerDTO(pydantic.BaseModel):
    passenger_category: Literal['ИЗТ', 'ИЗ', 'ИС', 'ИК', 'ИО', 'ДИ', 'ПЛ', 'РД', 'РДК', 'ОГД', 'ОВ', 'ИУ']
    name: str


class Status(str, enum.Enum):
    SELECTED_FOR_SCHEDULING = 'SELECTED_FOR_SCHEDULING'
    FINISHED = 'FINISHED'
    CANCELLED = 'CANCELLED'
    NEED_DYNAMIC_SCHEDULING = 'NEED_DYNAMIC_SCHEDULING'
    SCHEDULED = 'SCHEDULED'
    IN_PROGRESS = 'IN_PROGRESS'


class RequisitionDTO(pydantic.BaseModel):
    passenger_id: Union[int, None]
    start_time: datetime
    meet_time: datetime
    finish_time: Union[datetime, None]
    status: Status
    creation_time: datetime
    males_needed: int
    females_needed: int
    start_station: int
    end_station: int

    class Config:
        use_enum_values = True


class SexType(str, enum.Enum):
    Male = 'Male'
    Female = 'Female'


class RoleType(str, enum.Enum):
    Admin = 'Admin'
    Attendant = 'Attendant'
    Operator = 'Operator'
    Specialist = 'Specialist'


class SubRoleType(str, enum.Enum):
    Head_of_the_section = 'Head_of_the_section'
    Senior_inspector = 'Senior_inspector'
    Inspector = 'Inspector'


class EmployeeDTO(pydantic.BaseModel):
    full_name: str
    sex: SexType
    role: RoleType
    sub_role: Union[SubRoleType, None] = None

    class Config:
        use_enum_values = True

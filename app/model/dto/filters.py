from datetime import datetime, time
from typing import Union, Optional

import pydantic

from db.models.passengers import PassengerCategory
from db.models.requisitions import Status
from model.enum.enums import SexType, Weekday


class PassengerFilterDTO(pydantic.BaseModel):
    id: Optional[int] = None
    passenger_category: Optional[PassengerCategory] = None
    name: Optional[str] = None
    sex: Optional[SexType] = None
    pacemaker: Optional[bool] = None


class RequisitionFilterDTO(pydantic.BaseModel):
    passenger_id: Optional[int] = None
    start_time: Optional[datetime] = None
    meet_time: Optional[datetime] = None
    finish_time: Optional[datetime] = None
    status: Optional[Status] = None
    creation_time: Optional[datetime] = None
    males_needed: Optional[int] = None
    females_needed: Optional[int] = None
    start_station: Optional[int] = None
    end_station: Optional[int] = None


class ShiftFilterDTO(pydantic.BaseModel):
    id: Optional[int] = None
    employee_id: Optional[int] = None
    time_start: Optional[time] = None
    time_end: Optional[time] = None
    place_start: Optional[Union[int, str]] = None
    weekday: Optional[str] = None

    class Config:
        use_enum_values = True

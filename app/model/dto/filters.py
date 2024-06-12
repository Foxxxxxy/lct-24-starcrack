from datetime import datetime
from typing import Union, Optional

import pydantic

from db.models.passengers import PassengerCategory
from db.models.requisitions import Status


class PassengerFilterDTO(pydantic.BaseModel):
    passenger_category: Optional[PassengerCategory] = None
    name: Optional[str] = None


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
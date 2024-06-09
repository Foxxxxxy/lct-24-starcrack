from datetime import datetime
from typing import Union

import pydantic

from db.models.passengers import PassengerCategory
from db.models.requisitions import Status


class PassengerFilterDTO(pydantic.BaseModel):
    passenger_category: Union[PassengerCategory, None] = None
    name: Union[str, None] = None


class RequisitionFilterDTO(pydantic.BaseModel):
    passenger_id: Union[int, None] = None
    start_time: Union[datetime, None] = None
    meet_time: Union[datetime, None] = None
    finish_time: Union[datetime, None] = None
    status: Union[Status, None] = None
    creation_time: Union[datetime, None] = None
    males_needed: Union[int, None] = None
    females_needed: Union[int, None] = None
    start_station: Union[int, None] = None
    end_station: Union[int, None] = None

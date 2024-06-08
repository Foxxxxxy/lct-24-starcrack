from typing import Union

import pydantic

from db.models.passengers import PassengerCategory


class PassengerFilterDTO(pydantic.BaseModel):
    passenger_category: Union[PassengerCategory, None] = None
    name: Union[str, None] = None

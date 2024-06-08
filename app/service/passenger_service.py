from typing import List

from db.crud_passenger import *


def get_passengers_filtered(
    filter: PassengerFilterDTO, limit: int, offset: int, base_session: Session
) -> List[Passenger]:
    return get_filtered(filter, limit, offset, base_session)

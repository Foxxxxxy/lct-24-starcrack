from typing import List

from db.crud_passenger import *


def get_passengers(
        limit: int, offset: int, base_session: Session
):
    return get_passengers_crud(limit, offset, base_session)


def get_passenger_by_id_service(
        pas_id: int, base_session: Session
):
    return get_passenger_by_id_crud(pas_id, base_session)


def get_passengers_filtered(
    filter: PassengerFilterDTO, limit: int, offset: int, base_session: Session
) -> List[Passenger]:
    return get_filtered(filter, limit, offset, base_session)

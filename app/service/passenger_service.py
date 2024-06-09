from typing import List

from db.crud_passenger import *
from . import db_model_from_dto


def get_passengers(
    limit: int, offset: int, base_session: Session
):
    return get_passengers_crud(limit, offset, base_session)


def get_passenger_by_id_service(
    pas_id: int, base_session: Session
):
    return get_passenger_by_id_crud(pas_id, base_session)


def suggest_passenger_by_name(
    name: str, base_session: Session
):
    return suggest_by_name(name, base_session)


def add_passenger(
    passenger: PassengerDTO, base_session: Session
):
    db_passenger = db_model_from_dto(passenger, passengers.Passenger)
    return add_new_passenger(db_passenger, base_session)


def get_passengers_filtered(
    filter: PassengerFilterDTO, limit: int, offset: int, base_session: Session
) -> List[Passenger]:
    return get_filtered(filter, limit, offset, base_session)

from typing import List

from db.crud_passenger import *
from db.crud_requisitions import get_by_passenger_id
from model.dto.update_entity import PassengerUpdateDTO
from . import *


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


def update_passenger(
    passenger: PassengerUpdateDTO, base_session: Session
):
    db_passenger = get_passenger_by_id_crud(passenger.id, base_session)
    db_passenger = update_bd_objects(db_passenger, passenger.dict(exclude_unset=True))
    base_session.commit()
    return db_passenger


def delete_passenger(
    passenger_id: int, base_session: Session
):
    passenger_requisitions = get_by_passenger_id(passenger_id, base_session)
    for requisition in passenger_requisitions:
        base_session.delete(requisition)
    base_session.commit()

    passenger = get_passenger_by_id_crud(passenger_id, base_session)
    base_session.delete(passenger)

    base_session.commit()

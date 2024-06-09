from sqlalchemy.orm import Session

from db.models import passengers
from db.models.passengers import Passenger
from model.dto.filters import PassengerFilterDTO


def get_passengers_crud(
        limit: int, offset: int, base_session: Session
):
    passengers_list = base_session.query(passengers.Passenger).limit(limit).offset(offset).all()
    return passengers_list


def get_passenger_by_id_crud(
        pas_id: int, base_session: Session
):
    passenger = base_session.query(passengers.Passenger).filter(passengers.Passenger.id == pas_id).first()
    return passenger


def get_filtered(
    filter: PassengerFilterDTO, limit: int, offset: int, base_session: Session
):
    query = base_session.query(passengers.Passenger)
    filtered = __apply_filters(query, filter)
    return filtered.offset(offset).limit(limit).all()


def __apply_filters(query, filter: PassengerFilterDTO):
    for field, value in filter.dict(exclude_unset=True).items():
        if value is None:
            continue
        if type(value) is str:
            print("here")
            query = query.filter(getattr(Passenger, field).ilike(f"%{value}%"))
        else:
            query = query.filter(getattr(Passenger, field) == value)
    return query

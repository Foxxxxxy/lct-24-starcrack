from datetime import datetime

from db.crud_stations import get_station_by_name
from . import db_model_from_dto, update_bd_objects
from sqlalchemy.orm import Session
from db.crud_shifts import *
from model.dto.update_entity import ShiftUpdateDto


def get_shifts_by_employee(
    employee_id: int, limit: int, offset: int, base_session: Session
):
    return get_shifts_by_user(employee_id, limit, offset, base_session)


def get_shifts_by_date(
    date_start: datetime, date_end: datetime, limit: int, offset: int, base_session: Session
):
    return get_shifts_by_date_interval(date_start, date_end, limit, offset, base_session)


def get_shifts_day(
    day: str, limit, offset, base_session: Session
):
    return get_shifts_by_day(day, limit, offset, base_session)


def update_shift(shift: ShiftUpdateDto, base_session: Session):
    db_shift = get_shifts_by_id(shift.id, base_session)
    db_shift = update_bd_objects(db_shift, shift.dict(exclude_unset=True))
    base_session.commit()
    return db_shift


def create_shift(
    shift: ShiftDTO, base_session: Session
):
    shift.place_start = get_station_by_name(shift.place_start, base_session)
    db_shift = db_model_from_dto(shift, shifts.Shift)
    return create_new_shift(db_shift, base_session)


def delete_shift(
    shift_id: int, base_session: Session
):
    shift = get_shifts_by_id(shift_id, base_session)
    base_session.delete(shift)
    base_session.commit()


def get_shift_by_id(shift_id, base_session):
    return get_shifts_by_id(shift_id, base_session)


def get_shift_filtered(filters, limit, offset, base_session):
    return get_filtered(filters, limit, offset, base_session)

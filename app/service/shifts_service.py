from datetime import datetime
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
    db_shift = db_model_from_dto(shift, shifts.Shift)
    return create_new_shift(db_shift, base_session)

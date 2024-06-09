from datetime import datetime
from . import db_model_from_dto
from sqlalchemy.orm import Session
from db.crud_shifts import *


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


def create_shift(
    shift: ShiftDTO, base_session: Session
):
    db_shift = db_model_from_dto(shift, shifts.Shift)
    return create_new_shift(db_shift, base_session)

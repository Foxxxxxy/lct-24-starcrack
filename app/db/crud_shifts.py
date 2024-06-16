from datetime import datetime
from sqlalchemy import and_
from sqlalchemy.orm import Session
from db.models import shifts
from model.dto.entity import *
from model.dto.filters import ShiftFilterDTO


def get_shifts_by_user(
    employee_id: int, limit: int, offset: int, base_session: Session
):
    shifts_list = base_session.query(shifts.Shift).filter(shifts.Shift.employee_id == employee_id).\
        limit(limit).offset(offset).all()
    return shifts_list


def get_shifts_by_date_interval(
    date_start: datetime, date_end: datetime, limit: int, offset: int, base_session: Session
):
    shifts_list = base_session.query(shifts.Shift).filter(and_(
        shifts.Shift.time_start >= date_start,
        shifts.Shift.time_end <= date_end
        )
    ).limit(limit).offset(offset).all()
    return shifts_list


def get_shifts_by_day(
    day: str, limit: int, offset: int, base_session: Session
):
    shifts_list = base_session.query(shifts.Shift).filter(
        shifts.Shift.weekday == day
    ).limit(limit).offset(offset).all()
    return shifts_list


def create_new_shift(
    shift: shifts.Shift, base_session: Session
):
    base_session.add(shift)
    base_session.commit()
    base_session.refresh(shift)
    return shift


def get_shifts_by_id(
    shift_id: int, base_session: Session
):
    shift = base_session.query(shifts.Shift).filter(shifts.Shift.id == shift_id).first()
    return shift


def __apply_filters(query, filter: ShiftFilterDTO):
    for field, value in filter.dict(exclude_unset=True).items():
        if value is None:
            continue
        query = query.filter(getattr(shifts.Shift, field) == value)
    return query


def get_filtered(filters, limit: int, offset: int, base_session: Session):
    query = base_session.query(shifts.Shift)
    filtered = __apply_filters(query, filters)
    return filtered.offset(offset).limit(limit).all()

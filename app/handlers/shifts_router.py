from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.base import get_db
import service.shifts_service as shifts_service
from model.dto.entity import *
from model.dto.filters import PassengerFilterDTO

shifts_router = APIRouter()


@shifts_router.get("/employee")
async def get_shifts_list_by_employee_id(
    employee_id: int, limit: int, offset: int, base_session: Session = Depends(get_db)
):
    shifts_list = shifts_service.get_shifts_by_employee(employee_id, limit, offset, base_session)
    return shifts_list


@shifts_router.get("/date")
async def get_shifts_list_by_date(
    date_start: datetime, date_end: datetime, limit: int, offset: int, base_session: Session = Depends(get_db)
):
    shifts_list = shifts_service.get_shifts_by_date(date_start, date_end, limit, offset, base_session)
    return shifts_list


@shifts_router.get("/day")
async def get_shifts_list_by_day(
    day: str, limit: int, offset: int, base_session: Session = Depends(get_db)
):
    shifts_list = shifts_service.get_shifts_by_day(day, limit, offset, base_session)
    return shifts_list


@shifts_router.post("/")
async def create_shift(
    shift: ShiftDTO, base_session: Session = Depends(get_db)
):
    return shifts_service.create_shift(shift, base_session)

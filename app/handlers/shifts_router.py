from datetime import datetime
from typing import Annotated, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.base import get_db
import service.shifts_service as shifts_service
from model.dto.auth_models import UserOutputSchema
from model.dto.entity import *
from model.dto.filters import ShiftFilterDTO
from model.dto.update_entity import ShiftUpdateDto
from service import auth_service

shifts_router = APIRouter()


@shifts_router.get("/employee")
async def get_shifts_list_by_employee_id(
    employee_id: int, limit: int, offset: int, user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)],
        base_session: Session = Depends(get_db)
):
    shifts_list = shifts_service.get_shifts_by_employee(employee_id, limit, offset, base_session)
    return shifts_list


@shifts_router.get("/date")
async def get_shifts_list_by_date(
    date_start: datetime, date_end: datetime, limit: int, offset: int,
        user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)],
        base_session: Session = Depends(get_db)
) -> List[ShiftDTO]:
    shifts_list = shifts_service.get_shifts_by_date(date_start, date_end, limit, offset, base_session)
    return shifts_list


@shifts_router.get("/day")
async def get_shifts_list_by_day(
    day: str, limit: int, user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)],
        offset: int, base_session: Session = Depends(get_db)
) -> List[ShiftDTO]:
    shifts_list = shifts_service.get_shifts_by_day(day, limit, offset, base_session)
    return shifts_list


@shifts_router.post("/")
async def create_shift(
    shift: ShiftDTO, user: Annotated[UserOutputSchema, Depends(auth_service.auth_admin_spec_op)],
        base_session: Session = Depends(get_db)
) -> ShiftDTO:
    return shifts_service.create_shift(shift, base_session)


@shifts_router.post("/update")
async def update_shift(
        shift: ShiftUpdateDto, user: Annotated[UserOutputSchema, Depends(auth_service.auth_admin_spec_op)],
        base_session: Session = Depends(get_db)
) -> ShiftDTO:
    return shifts_service.update_shift(shift, base_session)


@shifts_router.delete("/")
async def delete_shift(
    shift_id: int, user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)],
        base_session: Session = Depends(get_db)
):
    shifts_service.delete_shift(shift_id, base_session)


@shifts_router.get("/id")
async def get_shift_by_id(
        shift_id: int, user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)],
        base_session: Session = Depends(get_db)
):
    return shifts_service.get_shift_by_id(shift_id, base_session)


@shifts_router.post("/filtered")
async def get_filtered_shifts(
        filters: ShiftFilterDTO, limit: int, offset: int, user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)],
        base_session: Session = Depends(get_db)
):
    return shifts_service.get_shift_filtered(filters, limit, offset, base_session)

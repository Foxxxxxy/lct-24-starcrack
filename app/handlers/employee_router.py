from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.base import get_db
from service import employee_service

employee_router = APIRouter()


@employee_router.get("/")
async def get_employees_list(
    limit: int, offset: int, base_session: Session = Depends(get_db)
):
    employees = employee_service.get_employees(limit, offset, base_session)
    return employees

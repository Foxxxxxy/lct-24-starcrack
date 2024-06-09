from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.base import get_db
from service import employee_service
from model.dto.entity import EmployeeDTO

employee_router = APIRouter()


@employee_router.get("/")
async def get_employees_list(
    limit: int, offset: int, base_session: Session = Depends(get_db)
):
    employees = employee_service.get_employees(limit, offset, base_session)
    return employees


@employee_router.get("/id")
async def get_employee_by_id(
    emp_id: int, base_session: Session = Depends(get_db)
):
    employee = employee_service.get_employees_by_id_service(emp_id, base_session)
    return employee


@employee_router.post("/")
async def add_employee(
    employee: EmployeeDTO, base_session: Session = Depends(get_db)
):
    return employee_service.add_employee(employee, base_session)

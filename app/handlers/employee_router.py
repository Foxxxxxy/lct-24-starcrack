from typing import Annotated, List

import fastapi.exceptions
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.base import get_db
from model.dto.auth_models import UserOutputSchema, SignUpSchema
from model.dto.update_entity import EmployeeUpdateDto
from model.enum.enums import RoleType
from service import employee_service, auth_service
from model.dto.entity import EmployeeDTO

employee_router = APIRouter()


@employee_router.get("/")
async def get_employees_list(
        limit: int, offset: int, user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)],
        base_session: Session = Depends(get_db)
) -> List[EmployeeDTO]:
    employees = employee_service.get_employees(limit, offset, base_session)
    return employees


@employee_router.post("/ids")
async def get_employee_by_ids(
        emp_ids: List[int], user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)],
        base_session: Session = Depends(get_db)
) -> List[EmployeeDTO]:
    answer = []
    for emp_id in emp_ids:
        answer.append(employee_service.get_employees_by_id_service(emp_id, base_session))
    return answer


@employee_router.get("/id")
async def get_employee_by_id(
        emp_id: int, user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)],
        base_session: Session = Depends(get_db)
) -> EmployeeDTO:
    employee = employee_service.get_employees_by_id_service(emp_id, base_session)
    return employee


@employee_router.get("/suggestions/")
async def suggest_employee(
        name: str, user: Annotated[UserOutputSchema, Depends(auth_service.auth_admin_spec_op)],
        base_session: Session = Depends(get_db)
) -> List[EmployeeDTO]:
    suggested_employees = employee_service.suggest_employee_by_name(name, base_session)
    return suggested_employees


@employee_router.post("/", response_model=UserOutputSchema)
async def add_employee(form: SignUpSchema, user: Annotated[UserOutputSchema, Depends(auth_service.auth_admin_spec_op)],
                       db: Session = Depends(get_db)):
    # if form.role not in [RoleType.Attendant, RoleType.Operator]:
    #     raise fastapi.exceptions.HTTPException(status_code=400)

    result = auth_service.sign_up(form, db)
    return result


@employee_router.post("/update")
async def update_employee(
        employee: EmployeeUpdateDto, user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)],
        base_session: Session = Depends(get_db)
) -> EmployeeDTO:
    return employee_service.update_employee(employee, base_session)


@employee_router.delete("/")
async def delete_employee(
        employee_id: int, user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)],
        base_session: Session = Depends(get_db)
):
    employee_service.delete_employee(employee_id, base_session)

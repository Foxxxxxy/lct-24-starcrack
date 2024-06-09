from sqlalchemy.orm import Session
from db.crud_employee import *
from . import db_model_from_dto
from model.dto.entity import EmployeeDTO


def get_employees(
        limit: int, offset: int, base_session: Session
):
    return get_everyone(limit, offset, base_session)


def get_employees_by_id_service(
        emp_id: int, base_session: Session
):
    return get_employees_by_id(emp_id, base_session)


def add_employee(
    employee: EmployeeDTO, base_session: Session
):
    db_employee = db_model_from_dto(employee, employees.Employee)
    return add_new_employee(db_employee, base_session)

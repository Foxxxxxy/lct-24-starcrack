from sqlalchemy.orm import Session
from db.crud_employee import *
from model.dto.update_entity import EmployeeUpdateDto
from . import db_model_from_dto, update_bd_objects
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


def suggest_employee_by_name(
    name: str, base_session: Session
):
    return suggest_by_name(name, base_session)


def update_employee(
    employee: EmployeeUpdateDto, base_session: Session
):
    db_employee = get_employees_by_id(employee.id, base_session)
    db_employee = update_bd_objects(db_employee, employee.dict(exclude_unset=True))
    base_session.commit()
    return db_employee

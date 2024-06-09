import json

from sqlalchemy.orm import Session
from db.models import employees


def get_everyone(
        limit: int, offset: int, base_session: Session
):
    employees_list = base_session.query(employees.Employee).limit(limit).offset(offset).all()
    return employees_list


def get_employees_by_id(
    emp_id: int, base_session: Session
):
    employee = base_session.query(employees.Employee).filter(employees.Employee.id == emp_id).first()
    return employee

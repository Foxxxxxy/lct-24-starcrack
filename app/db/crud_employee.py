import json

from sqlalchemy.orm import Session
from db.models import employees


def get_everyone(
        limit: int, offset: int, base_session: Session
):
    employees_list = base_session.query(employees.Employee).limit(limit).offset(offset).all()
    return employees_list


def add_new_employee(
    employee: employees.Employee, base_session: Session
):
    base_session.add(employee)
    base_session.commit()
    base_session.refresh(employee)
    return employee.id


def get_employees_by_id(
    emp_id: int, base_session: Session
):
    employee = base_session.query(employees.Employee).filter(employees.Employee.id == emp_id).first()
    return employee


def suggest_by_name(
    name: str, base_session: Session
):
    employees_list = base_session.query(employees.Employee).filter(employees.Employee.full_name.ilike(name + '%')).all()
    return employees_list


def suggest_by_username(
    name: str, base_session: Session
):
    employees_list = base_session.query(employees.Employee).filter(employees.Employee.username == name).all()
    return employees_list


def get_employee_by_name(db: Session, name: str) -> employees.Employee:
    return db.query(employees.Employee).filter(employees.Employee.full_name == name).first()

import json

from sqlalchemy.orm import Session
from db.models import employees


def get_everyone(
        limit: int, offset: int, base_session: Session
):
    employees_list = base_session.query(employees.Employee).limit(limit).offset(offset).all()
    return employees_list

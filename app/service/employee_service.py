from sqlalchemy.orm import Session
from db.crud_employee import *


def get_employees(
        limit: int, offset: int, base_session: Session
):
    return get_everyone(limit, offset, base_session)


def get_employees_by_id_service(
        emp_id: int, base_session: Session
):
    return get_employees_by_id(emp_id, base_session)

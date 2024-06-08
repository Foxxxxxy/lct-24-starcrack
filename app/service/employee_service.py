from sqlalchemy.orm import Session
from db.crud_employee import *


def get_employees(limit: int, offset: int, base_session: Session):
    return get_everyone(limit, offset, base_session)

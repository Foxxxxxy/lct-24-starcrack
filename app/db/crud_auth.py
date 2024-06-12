from sqlalchemy.orm import Session
from db.models.employees import Employee
from model.dto.auth_models import *


def get_user_by_id(db: Session, user_id: int) -> Employee:
    return db.query(Employee).filter(Employee.id == user_id).first()


def get_users(db: Session, skip: int = 0, limit: int = 100) -> list[Employee]:
    return db.query(Employee).offset(skip).limit(limit).all()


def create_user(db: Session, sign_up_form: SignUpSchema) -> Employee:
    data = sign_up_form.dict()
    # data['hashed_password'] = data['password']
    # del data['password']
    db_user = Employee(**data)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, id: int, user_update: UserUpdateSchema):
    user = db.query(Employee) \
        .filter(Employee.id == id).first()
    for field_name, field_value in user_update:
        if field_value is not None:
            setattr(user, field_name, field_value)
    db.commit()
    return user

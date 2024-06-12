from sqlalchemy import Column, Integer, String, Enum
from db.base import Base
from model.enum.enums import SexType, RoleType, SubRoleType


class Employee(Base):
    __tablename__ = 'employees'

    id = Column(Integer, primary_key=True)
    full_name = Column(String(255), nullable=False)
    sex = Column(Enum(SexType), nullable=False)
    role = Column(Enum(RoleType), nullable=False)
    sub_role = Column(Enum(SubRoleType), nullable=True)
    password = Column(String(255), nullable=False)

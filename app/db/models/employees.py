import enum

from sqlalchemy import Column, Integer, String, Enum
from db.base import Base


class SexType(enum.Enum):
    male = 'male'
    female = 'female'


class RoleType(enum.ENUM):
    Admin = 'Admin'
    Attendant = 'Attendant'
    Operator = 'Operator'
    Specialist = 'Specialist'


class SubRoleType(enum.Enum):
    Head_of_the_section = 'Head of the section'
    Senior_inspector = 'Senior inspector'
    Inspector = 'Inspector'


class Employee(Base):
    __tablename__ = 'Employees'

    id = Column(Integer, primary_key=True)
    full_name = Column(String(255), nullable=False)
    sex = Column(Enum(SexType), nullable=False)
    role = Column(Enum(RoleType), nullable=False)
    sub_role = Column(Enum(SubRoleType), nullable=False)

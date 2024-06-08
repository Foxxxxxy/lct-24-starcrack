from sqlalchemy import Column, Integer, String, Enum
from db.base import Base


class Employee(Base):
    __tablename__ = 'Employees'

    id = Column(Integer, primary_key=True)
    full_name = Column(String(255), nullable=False)
    sex = Column(Enum('Male', 'Female', name='gender_types'), nullable=False)
    role = Column(String(255), nullable=False)
    sub_role = Column(String(255), nullable=False)

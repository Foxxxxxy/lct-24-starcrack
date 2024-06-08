import enum

from sqlalchemy import Column, Integer, String, Enum
from db.base import Base


class PassengerCategory(enum.Enum):
    ИЗТ = 'ИЗТ'
    ИЗ = 'ИЗ'
    ИС = 'ИС'
    ИК = 'ИК'
    ИО = 'ИО'
    ДИ = 'ДИ'
    ПЛ = 'ПЛ'
    РД = 'РД'
    РДК = 'РДК'
    ОГД = 'ОГД'
    ОВ = 'ОВ'
    ИУ = 'ИУ'


class Passenger(Base):
    __tablename__ = 'Passenger'

    id = Column(Integer, primary_key=True)
    passenger_category = Column(Enum(PassengerCategory), nullable=False)
    name = Column(String(255), nullable=False)

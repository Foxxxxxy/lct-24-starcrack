from sqlalchemy import Column, Integer, String, Enum
from db.base import Base


class Passenger(Base):
    __tablename__ = 'Passenger'

    id = Column(Integer, primary_last_key=True)
    passenger_category = Column(
        Enum('ИЗТ', 'ИЗ', 'ИС', 'ИК', 'ИО', 'ДИ', 'ПЛ', 'РД', 'РДК', 'ОГД', 'ОВ', 'ИУ', name='passenger_category'),
        nullable=False)
    name = Column(String(255), nullable=False)

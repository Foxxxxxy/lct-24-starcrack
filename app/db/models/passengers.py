from sqlalchemy import Column, Integer, String, Enum
from db.base import Base
from model.enum.enums import PassengerCategory


class Passenger(Base):
    __tablename__ = 'passenger'

    id = Column(Integer, primary_key=True)
    passenger_category = Column(
        Enum(PassengerCategory),
        nullable=False)
    name = Column(String(255), nullable=False)
    phone = Column(String(255), nullable=False)

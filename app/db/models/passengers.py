from sqlalchemy import Column, Integer, String, Enum, Text, Boolean
from db.base import Base
from model.enum.enums import PassengerCategory, SexType


class Passenger(Base):
    __tablename__ = 'passenger'

    id = Column(Integer, primary_key=True)
    passenger_category = Column(
        Enum(PassengerCategory),
        nullable=False)
    sex = Column(Enum(SexType), nullable=False)
    name = Column(String(255), nullable=False)
    phone = Column(String(255), nullable=False)
    comment = Column(Text, nullable=True)
    pacemaker = Column(Boolean, nullable=False)

import enum

from sqlalchemy import Column, Integer, ForeignKey, Time, Enum
from sqlalchemy.orm import relationship
from db.base import Base
from model.enum.enums import Weekday



class Shift(Base):
    __tablename__ = 'shifts'

    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, ForeignKey('employees.id'), nullable=False)
    time_start = Column(Time, nullable=False)
    time_end = Column(Time, nullable=False)
    place_start = Column(Integer, ForeignKey('metro_stations.id'), nullable=True)
    weekday = Column(
        Enum(Weekday),
        nullable=False)

    # employee = relationship("employee")
    # place_start_ref = relationship("metro_stations")

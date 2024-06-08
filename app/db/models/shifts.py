from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP, Enum
from sqlalchemy.orm import relationship
from db.base import Base


class Weekday(Enum):
    Monday = 'Monday'
    Tuesday = 'Tuesday'
    Wednesday = 'Wednesday'
    Thursday = 'Thursday'
    Friday = 'Friday'
    Saturday = 'Saturday'
    Sunday = 'Sunday'


class Shift(Base):
    __tablename__ = 'Shifts'

    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, ForeignKey('Employees.id'), nullable=False)
    time_start = Column(TIMESTAMP, nullable=False)
    time_end = Column(TIMESTAMP, nullable=False)
    place_start = Column(Integer, ForeignKey('Metro_stations.id'), nullable=True)
    weekday = Column(
        Enum(Weekday),
        nullable=False)

    employee = relationship("Employee")
    place_start_ref = relationship("MetroStation")

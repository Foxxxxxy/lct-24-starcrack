from sqlalchemy import Column, Integer, JSON, Enum, DateTime

from sqlalchemy.sql import func
from db.base import Base


class EventType(Enum):
    DYNAMIC_SCHEDULE_REQUEST = 'DYNAMIC_SCHEDULE_REQUEST'
    UNSCHEDULED_REQUEST = 'UNSCHEDULED_REQUEST'


class Criticality(Enum):
    CRITICAL = 'CRITICAL'
    WARNING = 'WARNING'
    NORMAL = 'NORMAL'


class Event(Base):
    __tablename__ = 'Event'

    id = Column(Integer, primary_key=True, autoincrement=True)
    type = Column(Enum(EventType), nullable=False)
    data = Column(JSON, nullable=False)
    criticality = Column(Enum(Criticality), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
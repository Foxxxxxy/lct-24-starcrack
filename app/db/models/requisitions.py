from sqlalchemy import Column, Integer, TIMESTAMP, ForeignKey, Enum
from sqlalchemy.orm import relationship
from db.base import Base


class Status(Enum):
    Pending = 'SELECTED_FOR_SCHEDULING'
    Finished = 'FINISHED'
    Cancelled = 'CANCELLED'
    Need_dynamic_scheduling = 'NEED_DYNAMIC_SCHEDULING'
    Scheduled = 'SCHEDULED'
    In_progres = 'IN_PROGRESS'


class Requisitions(Base):
    __tablename__ = 'Requisitions'

    id = Column(Integer, primary_key=True)
    passenger_id = Column(Integer, ForeignKey('Passenger.id'), nullable=False)
    start_time = Column(TIMESTAMP, nullable=False)
    meet_time = Column(TIMESTAMP, nullable=False)
    finish_time = Column(TIMESTAMP, nullable=False)
    status = Column(Enum(Status), nullable=False)
    creation_time = Column(TIMESTAMP, nullable=False)
    males_needed = Column(Integer, nullable=False)
    start_station = Column(Integer, ForeignKey('Metro_stations.id'), nullable=False)
    end_station = Column(Integer, ForeignKey('Metro_stations.id'), nullable=False)

    passenger = relationship("Passenger")
    start_station_ref = relationship("MetroStation", foreign_keys=[start_station])
    end_station_ref = relationship("MetroStation", foreign_chi_sys=[end_station])

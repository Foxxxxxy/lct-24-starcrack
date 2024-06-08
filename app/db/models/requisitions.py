import enum
from sqlalchemy import Column, Integer, TIMESTAMP, ForeignKey, Enum
from sqlalchemy.orm import relationship
from db.base import Base
from model.enum.enums import Status


class Requisitions(Base):
    __tablename__ = 'Requisitions'

    id = Column(Integer, primary_key=True)
    passenger_id = Column(Integer, ForeignKey('Passenger.id'), nullable=True)
    start_time = Column(TIMESTAMP, nullable=False)
    meet_time = Column(TIMESTAMP, nullable=False)
    finish_time = Column(TIMESTAMP, nullable=True)
    status = Column(Enum(Status), nullable=False)
    creation_time = Column(TIMESTAMP, nullable=False)
    males_needed = Column(Integer, nullable=False)
    females_needed = Column(Integer, nullable=False)
    start_station = Column(Integer, ForeignKey('Metro_stations.id'), nullable=False)
    end_station = Column(Integer, ForeignKey('Metro_stations.id'), nullable=False)

    passenger = relationship("Passenger")
    # start_station_ref = relationship("Metro_stations", foreign_keys=[start_station])
    # end_station_ref = relationship("Metro_stations", foreign_keys=[end_station])


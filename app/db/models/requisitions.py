import enum
from sqlalchemy import Column, Integer, TIMESTAMP, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from db.base import Base
from model.enum.enums import Status, MethodType
from db.models.passengers import Passenger
from db.models.metro_stations import MetroStations


class Requisitions(Base):
    __tablename__ = 'requisitions'

    id = Column(Integer, primary_key=True)
    passenger_id = Column(Integer, ForeignKey('passenger.id'), nullable=False)
    passengers_amount = Column(Integer, nullable=False)
    start_time = Column(TIMESTAMP, nullable=False)
    meet_time = Column(TIMESTAMP, nullable=False)
    finish_time = Column(TIMESTAMP, nullable=True)
    status = Column(Enum(Status), nullable=False)
    creation_time = Column(TIMESTAMP, nullable=False)
    males_needed = Column(Integer, nullable=False)
    females_needed = Column(Integer, nullable=False)
    start_station = Column(Integer, ForeignKey('metro_stations.id'), nullable=False)
    start_station_comment = Column(Text, nullable=False)
    end_station = Column(Integer, ForeignKey('metro_stations.id'), nullable=False)
    end_station_comment = Column(Text, nullable=False)
    method = Column(Enum(MethodType), nullable=False)
    baggage = Column(Text, nullable=False)
    comment = Column(Text, nullable=False)

    # passenger = relationship("Passenger")
    # start_station_ref = relationship("Metro_stations", foreign_keys=[start_station])
    # end_station_ref = relationship("Metro_stations", foreign_keys=[end_station])


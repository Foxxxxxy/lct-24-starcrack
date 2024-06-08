from sqlalchemy import Column, Integer, String
from db.base import Base


class MetroStations(Base):
    __tablename__ = 'Metro_stations'

    id = Column(Integer, primary_key=True)
    line_name = Column(String(255), nullable=False)
    line_id = Column(Integer, nullable=False)
    station_name = Column(String(255), nullable=False)


from sqlalchemy.orm import Session
from db.models import metro_stations


def get_station_by_id(
    id: int, base_session: Session
):
    station = base_session.query(metro_stations.MetroStations).filter(
        metro_stations.MetroStations.id == id
    ).first()
    if station:
        return station.station_name


def get_station_by_name(
    name: str, base_session: Session
):
    station = base_session.query(metro_stations.MetroStations).filter(
        metro_stations.MetroStations.station_name == name
    ).first()
    if station:
        return station.id
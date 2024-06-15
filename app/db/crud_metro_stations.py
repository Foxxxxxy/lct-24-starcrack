from sqlalchemy.orm import Session

from db.models import metro_stations


def suggest_by_name(
    name: str, base_session: Session
):
    metro_station = base_session.query(metro_stations.MetroStations).filter(
        metro_stations.MetroStations.station_name.ilike(name + "%")
    ).all()
    return metro_station


def get_by_name(
    name: str, base_session: Session
):
    metro_station = base_session.query(metro_stations.MetroStations).filter(
        metro_stations.MetroStations.station_name == name
    ).first()
    return metro_station


def get_all(base_session: Session):
    return base_session.query(metro_stations.MetroStations).all()

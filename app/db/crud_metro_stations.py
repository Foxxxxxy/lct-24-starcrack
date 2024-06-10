from sqlalchemy.orm import Session

from db.models import metro_stations


def get_by_name(
    name: str, base_session: Session
):
    metro_station = base_session.query(metro_stations.MetroStations).filter(
        metro_stations.MetroStations.station_name == name
    ).first()
    return metro_station
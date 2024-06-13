from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.base import get_db
from db.crud_metro_stations import suggest_by_name

metro_stations_router = APIRouter()


@metro_stations_router.get("/suggestions/")
def suggest_metro_station(
    name: str, base_session: Session = Depends(get_db)
):
    return suggest_by_name(name, base_session)

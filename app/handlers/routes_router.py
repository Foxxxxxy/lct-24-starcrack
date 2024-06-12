from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from algorithms.DijkstraAlgorithm import DijkstraAlgorithm, get_dijkstra_algorithm
from db.base import get_db
from db.crud_metro_stations import get_by_name

routes_router = APIRouter()


@routes_router.get("/")
async def get_route(
        start_station_name: str,
        end_station_name: str,
        base_session: Session = Depends(get_db),
        algorithm: DijkstraAlgorithm = Depends(get_dijkstra_algorithm)
):
    start_station = get_by_name(start_station_name, base_session)
    end_station = get_by_name(end_station_name, base_session)

    return algorithm.calculate_path(start_station.id, end_station.id)

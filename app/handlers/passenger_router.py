from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.base import get_db
import service.passenger_service as passenger_service
from model.dto.filters import PassengerFilterDTO

passenger_router = APIRouter()


@passenger_router.get("/")
async def get_passengers_list(
        limit: int, offset: int, base_session: Session = Depends(get_db)
):
    passengers_list = passenger_service.get_passengers(limit, offset, base_session)
    return passengers_list


@passenger_router.get("/id")
async def get_passenger_id(
    pas_id: int, base_session: Session = Depends(get_db)
):
    passenger = passenger_service.get_passenger_by_id_service(pas_id, base_session)
    return passenger


@passenger_router.post("/")
async def get_passengers_filtered(
    filter: PassengerFilterDTO, limit: int, offset: int, base_session: Session = Depends(get_db)
):
    return passenger_service.get_passengers_filtered(filter, limit, offset, base_session)

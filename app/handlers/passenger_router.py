from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.base import get_db
import service.passenger_service as passenger_service
from model.dto.filters import PassengerFilterDTO

passenger_router = APIRouter()


@passenger_router.post("/")
async def get_passengers_filtered(
    filter: PassengerFilterDTO, limit: int, offset: int, base_session: Session = Depends(get_db)
):
    return passenger_service.get_passengers_filtered(filter, limit, offset, base_session)

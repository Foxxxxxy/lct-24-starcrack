from typing import Annotated, List, Union

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.base import get_db
import service.passenger_service as passenger_service
from model.dto.auth_models import UserOutputSchema
from model.dto.filters import PassengerFilterDTO
from model.dto.entity import PassengerDTO
from model.dto.update_entity import PassengerUpdateDTO
from service import auth_service

passenger_router = APIRouter()


@passenger_router.get("/")
async def get_passengers_list(
        limit: int, offset: int, base_session: Session = Depends(get_db)
) -> List[PassengerDTO]:
    passengers_list = passenger_service.get_passengers(limit, offset, base_session)
    return passengers_list


@passenger_router.get("/id")
async def get_passenger_id(
    pas_id: int, user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)],
        base_session: Session = Depends(get_db)
) -> PassengerDTO:
    passenger = passenger_service.get_passenger_by_id_service(pas_id, base_session)
    return passenger


@passenger_router.get("/suggestions/")
async def suggest_passenger(
    name: str, user: Annotated[UserOutputSchema, Depends(auth_service.auth_admin_spec_op)],
        base_session: Session = Depends(get_db),
) -> List[PassengerDTO]:
    suggested_passengers = passenger_service.suggest_passenger_by_name(name, base_session)
    return suggested_passengers


@passenger_router.post("/filtered")
async def get_passengers_filtered(
    filter: PassengerFilterDTO, limit: int,
        user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)],
        offset: int, base_session: Session = Depends(get_db)
) -> List[PassengerDTO]:
    return passenger_service.get_passengers_filtered(filter, limit, offset, base_session)


@passenger_router.post("/")
async def add_new_passenger(
     passenger: PassengerDTO, user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)],
        base_session: Session = Depends(get_db)
) -> int:
    return passenger_service.add_passenger(passenger, base_session)


@passenger_router.post("/update")
async def update_passenger(
    passenger: PassengerUpdateDTO, user: Annotated[UserOutputSchema, Depends(auth_service.auth_admin_spec_op)],
        base_session: Session = Depends(get_db)
) -> Union[PassengerDTO, None]:
    return passenger_service.update_passenger(passenger, base_session)

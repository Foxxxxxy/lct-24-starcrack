from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.base import get_db
from model.dto.auth_models import UserOutputSchema
from service import auth_service
from schedule_algorithm.schedule_algorithm import *
from algorithms.DijkstraAlgorithm import get_dijkstra_algorithm, DijkstraAlgorithm

schedule_router = APIRouter()


@schedule_router.get("/sort")
async def get_sorted_schedules(
    date_start: datetime, date_end: datetime,
        base_session: Session = Depends(get_db), algorithm: DijkstraAlgorithm = Depends(get_dijkstra_algorithm)
):
    return build_schedule_func(date_start, date_end, base_session, algorithm)


@schedule_router.get("/dynamic")
async def get_sorted_schedules(
    date_start: datetime, date_end: datetime,
        base_session: Session = Depends(get_db), algorithm: DijkstraAlgorithm = Depends(get_dijkstra_algorithm)
):
    return build_dynamic_schedule_func(date_start, date_end, base_session, algorithm)

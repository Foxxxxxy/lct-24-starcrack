from datetime import datetime
from typing import Annotated, Optional

import pytz
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from db.base import get_db
from model.dto.auth_models import UserOutputSchema
from service import auth_service
from schedule_algorithm.schedule_algorithm import *
from algorithms.DijkstraAlgorithm import get_dijkstra_algorithm, DijkstraAlgorithm

schedule_router = APIRouter()


@schedule_router.get("/sort")
async def get_sorted_schedules(background_tasks: BackgroundTasks,
                               date_start: Optional[datetime] = None, date_end: Optional[datetime] = None,
                               base_session: Session = Depends(get_db),
                               algorithm: DijkstraAlgorithm = Depends(get_dijkstra_algorithm)
                               ):
    if not date_end or not date_start:
        moscow_tz = pytz.timezone('Europe/Moscow')
        now = datetime.now(moscow_tz)
        date_start = now + timedelta(hours=24)

        date_end = now + timedelta(hours=48)
    # background_tasks.add_task(build_schedule_func, date_start, date_end, base_session, algorithm)
    return build_schedule_func(date_start, date_end, base_session, algorithm)


@schedule_router.get("/dynamic")
async def get_sorted_schedules_dynamic(
        date_start: Optional[datetime] = None, date_end: Optional[datetime] = None,
        base_session: Session = Depends(get_db), algorithm: DijkstraAlgorithm = Depends(get_dijkstra_algorithm)
):
    if not date_end or not date_start:
        moscow_tz = pytz.timezone('Europe/Moscow')
        now = datetime.now(moscow_tz)
        date_start = now
        date_end = now + timedelta(hours=24)

    return build_dynamic_schedule_func(date_start, date_end, base_session, algorithm)

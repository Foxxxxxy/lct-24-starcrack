import datetime
import importlib
from abc import ABC, abstractmethod

from apscheduler.triggers.cron import CronTrigger
from fastapi import Depends
from sqlalchemy.orm import Session

from algorithms.CreateTimetableAlgorithm import CreateTimetableAlgorithm
from db.base import get_db
from db.crud_requisitions import get_by_status
from model.enum.enums import Status
from utils.logger import logger


class Executor(ABC):

    @staticmethod
    @abstractmethod
    def execute_task():
        pass

    @staticmethod
    @abstractmethod
    def get_cron_trigger() -> CronTrigger:
        pass


class CreateTimetableExecutor(Executor):

    @staticmethod
    def execute_task():
        timetable_date = datetime.date.today() + datetime.timedelta(days=1)
        logger.info(f"Start creating timetable for date {timetable_date}...")

        base_session = next(get_db())
        app = importlib.import_module('handlers.main.app')
        deikstra_algorithm = app.state.dijkstra_algorithm
        requisitions_list = get_by_status(Status.SELECTED_FOR_SCHEDULING, base_session)
        logger.info(f"Found {len(requisitions_list)} candidates for scheduling...")

        algorithm = CreateTimetableAlgorithm()
        algorithm.create_timetable(base_session, deikstra_algorithm)

        logger.info(f"Finished creating timetable for date {timetable_date}!")

    @staticmethod
    def get_cron_trigger() -> CronTrigger:
        return CronTrigger(hour=0, minute=0, second=0)

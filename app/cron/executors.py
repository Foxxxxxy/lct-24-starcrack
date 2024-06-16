import datetime
from abc import ABC, abstractmethod

from apscheduler.triggers.cron import CronTrigger

from algorithms.CreateTimetableAlgorithm import CreateTimetableAlgorithm
from db.base import get_db
from db.crud_requisitions import get_by_status
from handlers.main import get_dijkstra_algorithm
from model.enum.enums import Status
from utils.logger import logger


class Executor(ABC):

    @staticmethod
    @abstractmethod
    def execute_task(*args):
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
        requisitions_list = get_by_status(Status.SELECTED_FOR_SCHEDULING, base_session)
        logger.info(f"Found {len(requisitions_list)} candidates for scheduling...")

        algorithm = CreateTimetableAlgorithm()
        algorithm.create_timetable(base_session, get_dijkstra_algorithm())

        logger.info(f"Finished creating timetable for date {timetable_date}!")

    @staticmethod
    def get_cron_trigger() -> CronTrigger:
        return CronTrigger(hour=21, minute=0)

import datetime
from abc import ABC, abstractmethod

from apscheduler.triggers.cron import CronTrigger

from algorithms.CreateTimetableAlgorithm import CreateTimetableAlgorithm
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

        algorithm = CreateTimetableAlgorithm()
        algorithm.create_timetable()

        logger.info(f"Finished creating timetable for date {timetable_date}!")

    @staticmethod
    def get_cron_trigger() -> CronTrigger:
        return CronTrigger(second="*/10")

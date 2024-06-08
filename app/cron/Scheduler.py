from typing import List

from apscheduler.schedulers.base import BaseScheduler

from cron.executors import CreateTimetableExecutor, Executor
from utils.logger import logger


class Scheduler:
    registered_executors: List[Executor] = [CreateTimetableExecutor]

    def __init__(self, internal_scheduler: BaseScheduler):
        self.internal_scheduler = internal_scheduler

    def register_executors(self):
        logger.info("Registering executors...")

        for executor in self.registered_executors:
            self.internal_scheduler.add_job(executor.execute_task, executor.get_cron_trigger())
            logger.info(f"{executor} registered!")

    def start(self):
        logger.info("Starting scheduler...")
        self.internal_scheduler.start()

    def shutdown(self):
        logger.info("Shutting scheduler down...")
        self.internal_scheduler.shutdown()

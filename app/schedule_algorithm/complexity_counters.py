from abc import abstractmethod, ABC
from math import ceil

from schedule_algorithm.entity_classes import *


class Components(ABC):
    @abstractmethod
    def count_weight(self, task: Task):
        pass


class TimeComplexity(Components):

    def count_weight(self, task: Task):
        return -ceil(task.duration)


class PeopleComplexity(Components):

    def count_weight(self, task: Task):
        alpha = 1
        return task.females_needed - 2 * task.males_needed - (task.females_needed + task.males_needed) * alpha


class AttemptsComplexity(Components):

    def count_weight(self, task: Task):
        return task.attempts * 3

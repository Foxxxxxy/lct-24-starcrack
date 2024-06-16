from schedule_algorithm.complexity_counters import *


class WeightCounter:

    def __init__(self):
        self.weight_components = [TimeComplexity(), PeopleComplexity()]

    def count_weight(self, task: Task):
        for component in self.weight_components:
            task.weight += component.count_weight(task)

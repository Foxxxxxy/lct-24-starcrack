from datetime import timedelta, datetime
import random


class Task:
    def __init__(self, task):
        self.id = task.id
        self.duration = (task.finish_time - task.start_time).total_seconds() / 60
        self.start_time = task.start_time
        self.males_needed = task.males_needed
        self.females_needed = task.females_needed
        self.status = task.status  # будем менять в конце скрипта
        self.employees = []  # будем тоже менять в по ходу скрипта
        self.start_point = task.start_station
        self.end_point = task.end_station
        self.finish_time = task.finish_time
        self.weight = 0
        self.attempts = 0
        # изначально будем очев задавать всем заявкам 0 вес, если понадобятся еще поля - добавим


class Executor:
    def __init__(self, executor, shift, date_start, lunch):
        self.id = executor.id
        self.current_station = shift.place_start
        self.shift_start = shift.time_start
        self.free_from = shift.time_start
        self.shift_end = shift.time_end
        self.sex = executor.sex
        self.tasks = []
        if not lunch:
            dt_start = datetime.combine(date_start.date(), shift.time_start)
            dt_end = datetime.combine(date_start.date(), shift.time_end)

            shift_duration = dt_end - dt_start
            half_shift_duration = shift_duration / 2
            random_adjustment = random.choice([-1, 0, 1])
            lunch_start = dt_start + half_shift_duration + timedelta(hours=random_adjustment)
            lunch_end = lunch_start + timedelta(hours=1)
        else:
            lunch_start = lunch.start_lunch.replace(tzinfo=None)
            lunch_end = lunch.end_lunch.replace(tzinfo=None)
        self.lunch = [lunch_start, lunch_end]

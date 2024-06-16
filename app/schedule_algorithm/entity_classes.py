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
    def __init__(self, executor, shift):
        self.id = executor.id
        self.current_station = shift.place_start
        self.shift_start = shift.time_start
        self.free_from = shift.time_start
        self.shift_end = shift.time_end
        self.sex = executor.sex
        self.tasks = []

import heapq
from datetime import time, timedelta, datetime
from typing import List

from sqlalchemy.orm import Session

from db.crud_stations import get_station_by_id
from db.crud_requisitions import update_requisition_employee, update_requisition_status, \
    employee_to_requisition, get_requisition_by_timedelta_status, get_requisitions_by_employee_id, \
    update_requisition_time, get_by_ids, get_lunches
from db.crud_shifts import get_shifts_by_day
from db.crud_employee import get_employees_by_id
from db.models.lunch import Lunch
from model.enum.enums import SexType
from schedule_algorithm.entity_classes import Task
from schedule_algorithm.weight_counter import *


def check_suitability_sex(executor, males, females):
    if executor.sex == SexType.Male:
        if males > 0:
            return 1
        elif females > 0:
            return 0.3
    else:
        if females > 0:
            return 1
        else:
            return None


def is_time_within_limit(distance, time_free, time_start):
    distance_timedelta = timedelta(minutes=distance)
    additional_time = timedelta(minutes=15)
    time_free_datetime = datetime.combine(time_start.date(), time_free)

    final_time = time_free_datetime + distance_timedelta + additional_time

    return final_time < time_start


def not_lunch(lunch_time, task):
    start, end = task.start_time, task.finish_time
    lunch_start, lunch_end = lunch_time
    if lunch_end <= start or lunch_start >= end:
        return True
    else:
        return False


def check_suitability_distance(executor, task, algorithm):
    distance = algorithm.calculate_path(executor.current_station, task.start_point)["eta"]
    if is_time_within_limit(distance, executor.free_from, task.start_time) and executor.shift_end >= task.finish_time.time():
        return -distance
    return None


class Heap:
    def __init__(self):
        self._queue = []
        self._index = 0

    def add(self, task: Task):
        priority = -task.weight
        heapq.heappush(self._queue, (task.start_time, priority, self._index, task))
        self._index += 1

    def pop(self):
        if self.is_empty():
            raise IndexError("Pop from empty queue")
        _, _, _, task = heapq.heappop(self._queue)
        return task

    def is_empty(self):
        return len(self._queue) == 0


def executor_appointment(task, executors, algorithm, males, females):
    possible = []
    for executor_id, executor in executors.items():
        if executor_id not in task.employees:
            suitability_sex = check_suitability_sex(executor, males, females)
            suitability_distance = check_suitability_distance(executor, task, algorithm)
            if suitability_sex and suitability_distance and not_lunch(executor.lunch, task):
                suitability = suitability_sex + suitability_distance
                possible.append([suitability, executor])
    if possible:
        executor = max(possible, key=lambda x: x[0])[1]
        if males and executor.sex == SexType.Male:
            males -= 1
        else:
            females -= 1
        print(task.id, possible[-1][1].id, executor.id, males, females)
        return executor, males, females
    return None, None, None


def not_busy(executor, start, finish):
    for task in executor.tasks:
        task_start, task_end = task

        if not (finish <= task_start or start >= task_end):
            return False
    return True


def executor_appointment_dynamic(task, executors, algorithm, males, females):
    possible = []
    for executor_id, executor in executors.items():
        if executor_id not in task.employees:
            suitability_sex = check_suitability_sex(executor, males, females)
            suitability_distance = check_suitability_distance(executor, task, algorithm)
            if suitability_sex and suitability_distance and not_lunch(executor.lunch, task):
                seconds_to_subtract = abs(suitability_distance) * 60
                time_delta_start = timedelta(seconds=seconds_to_subtract)
                start_time = task.start_time - time_delta_start
                time_delta_end = timedelta(minutes=40)
                finish_time = task.finish_time + time_delta_end
                if not_busy(executor, start_time, finish_time):
                    suitability = suitability_sex + suitability_distance
                    possible.append([suitability, executor])
    if possible:
        executor = max(possible, key=lambda x: x[0])[1]
        if males and executor.sex == SexType.Male:
            males -= 1
        else:
            females -= 1
        return executor, males, females
    return None, None, None


def get_executors(date_start, base_session):
    day = date_start.weekday()
    shifts = get_shifts_by_day(weekdays[day], 1000, 0, base_session)
    executors = [Executor(get_employees_by_id(shift.employee_id, base_session), shift, date_start, None) for shift in shifts]
    executors_dict = {}
    latest_shift_end = None
    for executor in executors:
        executors_dict[executor.id] = executor
        if latest_shift_end is None or executor.shift_end > latest_shift_end:
            latest_shift_end = executor.shift_end
    return executors_dict, latest_shift_end


def get_executor_dynamic(date_start, base_session):
    day = date_start.weekday()
    shifts = get_shifts_by_day(weekdays[day], 1000, 0, base_session)
    executors = [Executor(get_employees_by_id(shift.employee_id, base_session), shift, date_start,
                          get_lunches(shift.employee_id, date_start, date_start + timedelta(days=1), base_session)) for shift in shifts]
    executors_dict = {}
    latest_shift_end = None
    for executor in executors:
        tasks = get_requisitions_by_employee_id(executor.id, 1000, 0, base_session)
        for task in tasks:
            task.start_time = task.start_time.replace(tzinfo=None)
            task.finish_time = task.finish_time.replace(tzinfo=None)
            executor.tasks.append([task.start_time, task.finish_time])
        executors_dict[executor.id] = executor
        if latest_shift_end is None or executor.shift_end > latest_shift_end:
            latest_shift_end = executor.shift_end
    return executors_dict, latest_shift_end


def get_heap(tasks):
    counter = WeightCounter()
    shift_heap = Heap()
    for task in tasks:
        counter.count_weight(task)
        task.finish_time = task.finish_time.replace(tzinfo=None)
        task.start_time = task.start_time.replace(tzinfo=None)
        shift_heap.add(task)
    return shift_heap


def get_tasks(start, end, base_session):
    tasks = get_requisition_by_timedelta_status(start, end, "SELECTED_FOR_SCHEDULING",base_session)
    tasks = [Task(x) for x in tasks]
    return tasks


def get_tasks_dynamic(start, end, base_session):
    tasks = get_requisition_by_timedelta_status(start, end, "NEED_DYNAMIC_SCHEDULING", base_session)
    tasks = [Task(x) for x in tasks]
    return tasks


weekdays = {0: "Monday", 1: "Tuesday", 2: "Wednesday", 3: "Thursday", 4: "Friday", 5: "Saturday", 6: "Sunday"}


def build_schedule_func(start, end, base_session: Session, algorithm):
    tasks = get_tasks(start, end, base_session)  # тут еще добавить какие статусы заявки подходят
    start = start.replace(tzinfo=None)
    executors, latest_shift_time = get_executors(start, base_session)
    tasks_heap = get_heap(tasks)
    answer = {}
    if tasks_heap.is_empty() or not executors:
        return "No task or no executors"
    current_task = tasks_heap.pop()
    latest_shift_time = datetime.combine(current_task.finish_time.date(), latest_shift_time)
    while not tasks_heap.is_empty() and current_task.finish_time <= latest_shift_time:
        males = current_task.males_needed
        females = current_task.females_needed
        while males or females:
            executor, males, females = executor_appointment(current_task, executors, algorithm, males, females)
            if executor is None:
                current_task.weight += 10
                current_task.start_time = current_task.start_time + timedelta(minutes=10)
                current_task.finish_time = current_task.finish_time + timedelta(minutes=10)
                current_task.employees = []
                tasks_heap.add(current_task)
                break
            else:
                current_task.employees.append(executor.id)
        for ex_id in current_task.employees:
            executors[ex_id].current_station = current_task.end_point
            executors[ex_id].free_from = current_task.finish_time.time()
            employee_to_requisition(current_task.id, ex_id, base_session)
            # update_requisition_status(current_task.id, "SCHEDULED", base_session)
            current_task.status = "SCHEDULED"
            # update_requisition_time(current_task.id, current_task.start_time, current_task.finish_time, base_session)
            answer[current_task.id] = current_task
        current_task = tasks_heap.pop()

    dynamic_tasks = {}
    while not tasks_heap.is_empty():
        current_task = tasks_heap.pop()
        # update_requisition_status(current_task.id, "NEED_DYNAMIC_SCHEDULING", base_session)
        dynamic_tasks[current_task.id] = current_task
    print(answer, dynamic_tasks)
    update_lunches(executors, base_session)
    update_db_tasks(answer, base_session)
    update_dynamic_db_tasks(dynamic_tasks, base_session)
    return answer, dynamic_tasks


def update_db_tasks(tasks_dict: dict, base_session: Session):
    db_tasks_list = get_by_ids([task_id for task_id in tasks_dict], base_session)
    for task in db_tasks_list:
        cur_task = tasks_dict[task.id]
        task.start_time = cur_task.start_time
        task.finish_time = cur_task.finish_time
        task.status = cur_task.status
        base_session.add(task)
    base_session.commit()


def update_lunches(executors, base_session):
    for id in executors:
        executor = executors[id]
        lunch = Lunch()
        lunch.start_lunch = executor.lunch[0]
        lunch.end_lunch = executor.lunch[1]
        lunch.executor_id = executor.id
        base_session.add(lunch)
    base_session.commit()


def update_dynamic_db_tasks(tasks_dict: dict, base_session: Session):
    db_tasks_list = get_by_ids([task_id for task_id in tasks_dict], base_session)
    for task in db_tasks_list:
        cur_task = tasks_dict[task.id]
        task.status = cur_task.status
        base_session.add(task)
    base_session.commit()


def build_dynamic_schedule_func(start, end, base_session: Session, algorithm):
    tasks = get_tasks_dynamic(start, end, base_session)
    start = start.replace(tzinfo=None)
    executors, latest_shift_time = get_executor_dynamic(start, base_session)
    tasks_heap = get_heap(tasks)
    answer = {}
    if tasks_heap.is_empty() or not executors:
        return "No task or no executors"
    current_task = tasks_heap.pop()
    latest_shift_time = datetime.combine(current_task.finish_time.date(), latest_shift_time)
    while not tasks_heap.is_empty() and current_task.finish_time <= latest_shift_time:
        males = current_task.males_needed
        females = current_task.females_needed
        while males or females:
            executor, males, females = executor_appointment_dynamic(current_task, executors, algorithm, males, females)
            if executor is None:
                current_task.weight += 10
                current_task.start_time = current_task.start_time + timedelta(minutes=10)
                current_task.finish_time = current_task.finish_time + timedelta(minutes=10)
                current_task.employees = []
                tasks_heap.add(current_task)
                break
            else:
                current_task.employees.append(executor.id)
        for ex_id in current_task.employees:
            executors[ex_id].current_station = current_task.end_point
            executors[ex_id].free_from = current_task.finish_time.time()
            employee_to_requisition(current_task.id, ex_id, base_session)
            # update_requisition_status(current_task.id, "SCHEDULED", base_session)
            current_task.status = "SCHEDULED"
            # update_requisition_time(current_task.id, current_task.start_time, current_task.finish_time, base_session)
            answer[current_task.id] = current_task
        current_task = tasks_heap.pop()

    dynamic_tasks = {}
    while not tasks_heap.is_empty():
        current_task = tasks_heap.pop()
        dynamic_tasks[current_task.id] = current_task
        # update_requisition_status(current_task.id, "NEED_DYNAMIC_SCHEDULING", base_session)

    update_db_tasks(answer, base_session)
    update_dynamic_db_tasks(dynamic_tasks, base_session)
    return answer

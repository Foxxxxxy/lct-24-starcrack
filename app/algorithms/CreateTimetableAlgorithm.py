from datetime import datetime, timedelta

from fastapi import Request

from schedule_algorithm.schedule_algorithm import build_schedule_func


class CreateTimetableAlgorithm:

    def create_timetable(self, base_session, algorithm):
        now = datetime.now()
        start = now + timedelta(hours=24)
        end = now + timedelta(hours=48)
        return build_schedule_func(start, end, base_session, algorithm)


def get_dijkstra_algorithm(request: Request) -> CreateTimetableAlgorithm:
    return request.app.state.dijkstra_algorithm


import datetime
from typing import List

import fastapi.exceptions
import json
from datetime import datetime, timedelta

from sqlalchemy import and_
from sqlalchemy.orm import Session

from db.crud_employee import get_employees_by_id
from db.models import requisitions
from model.dto.filters import RequisitionFilterDTO
from db.models import executer_to_requisition
from model.enum.enums import Status
from utils.logger import logger


def get_everything(
        limit: int, offset: int, base_session: Session
):
    requisitions_list = base_session.query(requisitions.Requisitions).limit(limit).offset(offset).all()
    return requisitions_list


def get_scheduled(
    date: datetime.date, base_session: Session
):
    next_day = date + timedelta(days=1)
    requisitions_list = base_session.query(requisitions.Requisitions).filter(and_(
            requisitions.Requisitions.status == requisitions.Status.SCHEDULED,
            requisitions.Requisitions.start_time >= date,
            requisitions.Requisitions.start_time < next_day
        )
    ).all()

    employees_dict = {}
    for requisition in requisitions_list:
        employees = get_employees_by_requisitions(requisition.id, base_session)
        requisition.employees = employees
        for employee in employees:
            if employee not in employees_dict:
                employees_dict[employee] = []
            employees_dict[employee].append(requisition)

    res = [{"employee": e, "requisitions": r} for e, r in employees_dict.items()]
    logger.info(res)
    return res


def get_requisition_by_id(
        req_id: int, base_session: Session
):
    requisition = base_session.query(requisitions.Requisitions).filter(requisitions.Requisitions.id == req_id).first()
    return requisition


def add_new_requisition(
    requisition: requisitions.Requisitions, base_session: Session
):
    base_session.add(requisition)
    base_session.commit()
    base_session.refresh(requisition)
    return {"id": requisition.id}


def get_filtered(
    filter: RequisitionFilterDTO, limit: int, offset: int, base_session: Session
):
    query = base_session.query(requisitions.Requisitions)
    filtered = __apply_filters(query, filter)
    return filtered.offset(offset).limit(limit).all()


def get_by_status(
    status: Status, base_session: Session
):
    requisitions_list = base_session.query(requisitions.Requisitions).filter(
        requisitions.Requisitions.status == status
    ).all()
    return requisitions_list


def get_by_passenger_id(
    passenger_id: int, base_session: Session
):
    requisitions_list = base_session.query(requisitions.Requisitions).filter(
        requisitions.Requisitions.passenger_id == passenger_id
    ).all()
    return requisitions_list


def update_requisition_employee(
    req_id: int, executor_id: int, base_session: Session
):
    requisition = base_session.query(requisitions.Requisitions).filter(
        requisitions.Requisitions.id == req_id
    ).first()
    requisition.executor_id = executor_id
    base_session.add(requisition)
    base_session.commit()
    return requisition


def __apply_filters(query, filter: RequisitionFilterDTO):
    for field, value in filter.dict(exclude_unset=True).items():
        if value is None:
            continue
        if field == "start_time":
            date = value.date()
            query = query.filter(
                date <= requisitions.Requisitions.start_time, requisitions.Requisitions.start_time < date + timedelta(days=1)
            )
        elif field == "end_time":
            continue
        else:
            query = query.filter(getattr(requisitions.Requisitions, field) == value)
    return query


def update_status_by_id(
    id: int, status: Status, base_session: Session
):
    requisition = get_requisition_by_id(id, base_session)
    if requisition is None:
        raise fastapi.exceptions.HTTPException(status_code=404)

    requisition.status = status
    base_session.commit()


def get_requisition_by_timedelta_status(
    date_start: datetime, date_end: datetime, status: str, base_session: Session
):
    requisitions_list = base_session.query(requisitions.Requisitions).filter(and_(
        requisitions.Requisitions.start_time >= date_start,
        requisitions.Requisitions.finish_time <= date_end,
        requisitions.Requisitions.status == status
        )
    ).all()
    return requisitions_list


def update_requisition_time(
    req_id: int, start_time: datetime, end_time: datetime, base_session
):
    requisition = base_session.query(requisitions.Requisitions).filter(
        requisitions.Requisitions.id == req_id
    ).first()
    requisition.start_time = start_time
    requisition.finish_time = end_time
    base_session.add(requisition)
    base_session.commit()
    return


def update_requisition_status(
    req_id: int, status: str, base_session: Session
):
    requisition = base_session.query(requisitions.Requisitions).filter(
        requisitions.Requisitions.id == req_id
    ).first()
    requisition.status = status
    base_session.add(requisition)
    base_session.commit()
    return requisition


def employee_to_requisition(
    requisition_id: int, employee_id: int, base_session: Session
):
    string = executer_to_requisition.ExecutorToRequisition()
    string.requisition_id = requisition_id
    string.employee_id = employee_id
    base_session.add(string)
    base_session.commit()
    base_session.refresh(string)
    return


def get_requisitions_by_employee_id(
    emp_id: int, limit: int, offset: int, base_session: Session
):
    requisitions = base_session.query(executer_to_requisition.ExecutorToRequisition).filter(
        executer_to_requisition.ExecutorToRequisition.employee_id == emp_id).limit(limit).offset(offset).all()
    answer = []
    for req in requisitions:
        new_req = get_requisition_by_id(req.requisition_id, base_session)
        answer.append(new_req)
    return answer


def get_employees_by_requisitions(
    req_id: int, base_session: Session
):
    employees = base_session.query(executer_to_requisition.ExecutorToRequisition).filter(
        executer_to_requisition.ExecutorToRequisition.requisition_id == req_id).all()
    answer = []
    for employee in employees:
        new_emp = get_employees_by_id(employee.employee_id, base_session)
        answer.append(new_emp)
    return answer


def delete_executor_to_requisition_by_requisition_ids(
    req_ids: List[int], base_session: Session
):
    executor_to_requisition_to_delete = base_session.query(executer_to_requisition.ExecutorToRequisition).filter(
        executer_to_requisition.ExecutorToRequisition.requisition_id.in_(req_ids)).all()
    logger.info(executor_to_requisition_to_delete)
    for e in executor_to_requisition_to_delete:
        base_session.delete(e)


def delete_requisitions_employee(
    req_id: int, base_session: Session
):
    string_to_del = base_session.query(executer_to_requisition.ExecutorToRequisition).filter(
        executer_to_requisition.ExecutorToRequisition.requisition_id == req_id
    ).all()
    for string in string_to_del:
        base_session.delete(string)
    return

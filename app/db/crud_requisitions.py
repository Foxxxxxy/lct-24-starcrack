import datetime

import fastapi.exceptions
from sqlalchemy.orm import Session
from db.models import requisitions
from model.dto.filters import RequisitionFilterDTO

from model.enum.enums import Status


def get_everything(
        limit: int, offset: int, base_session: Session
):
    requisitions_list = base_session.query(requisitions.Requisitions).limit(limit).offset(offset).all()
    return requisitions_list


def get_scheduled(
    date: datetime.date, base_session: Session
):
    requisitions_list = base_session.query(requisitions.Requisitions).filter(
        requisitions.Requisitions.status == Status.SCHEDULED and
        date <= requisitions.Requisitions.start_time <= date + datetime.timedelta(days=1)
    ).all()
    return requisitions_list


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


def __apply_filters(query, filter: RequisitionFilterDTO):
    for field, value in filter.dict(exclude_unset=True).items():
        if value is None:
            continue
        if type(value) is str:
            print("here")
            query = query.filter(getattr(requisitions.Requisitions, field).ilike(f"%{value}%"))
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

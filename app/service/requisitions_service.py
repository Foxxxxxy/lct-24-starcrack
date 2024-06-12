from sqlalchemy.orm import Session
from db.crud_requisitions import *
from typing import List
from . import db_model_from_dto, update_bd_objects
from model.dto.entity import RequisitionDTO
from model.dto.update_entity import RequisitionUpdateDTO
from db.crud_stations import *


def update_requisition_station_to_add(new_requisition, base_session):
    new_requisition.start_station = get_station_by_name(new_requisition.start_station, base_session)
    new_requisition.end_station = get_station_by_name(new_requisition.end_station, base_session)
    return


def update_requisition_station_to_response(db_requisition, base_session):
    db_requisition.start_station = get_station_by_id(db_requisition.start_station, base_session)
    db_requisition.end_station = get_station_by_id(db_requisition.end_station, base_session)
    return


def get_requisitions(
    limit: int, offset: int, base_session: Session
) -> List[requisitions.Requisitions]:
    requisitions_l = get_everything(limit, offset, base_session)
    for requisition in requisitions_l:
        update_requisition_station_to_response(requisition, base_session)
    return requisitions_l



def get_requisition_by_id_service(
    req_id: int, base_session: Session
) -> requisitions.Requisitions:
    return get_requisition_by_id(req_id, base_session)


def create_requisition(
    requisition: RequisitionDTO, base_session: Session
):
    update_requisition_station_to_add(requisition, base_session)
    db_requisition = db_model_from_dto(requisition, requisitions.Requisitions)
    new_requisition = add_new_requisition(db_requisition, base_session)
    update_requisition_station_to_response(requisition, base_session)
    return new_requisition


def get_requisitions_filtered(
    filter: RequisitionFilterDTO, limit: int, offset: int, base_session: Session

) -> List[requisitions.Requisitions]:
    requisitions_l = get_filtered(filter, limit, offset, base_session)
    for requisition in requisitions_l:
        update_requisition_station_to_response(requisition, base_session)
    return requisitions_l


def update_requisition(
    new_requisition: RequisitionUpdateDTO, base_session: Session
):
    update_requisition_station_to_add(new_requisition, base_session)
    db_requisition = get_requisition_by_id(new_requisition.id, base_session)
    db_requisition = update_bd_objects(db_requisition, new_requisition.dict(exclude_unset=True))
    base_session.commit()
    update_requisition_station_to_response(db_requisition, base_session)
    return db_requisition

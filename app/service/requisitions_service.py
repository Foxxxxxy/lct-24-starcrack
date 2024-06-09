from sqlalchemy.orm import Session
from db.crud_requisitions import *
from typing import List
from . import db_model_from_dto

def get_requisitions(
    limit: int, offset: int, base_session: Session
) -> List[requisitions.Requisitions]:
    return get_everything(limit, offset, base_session)


def get_requisition_by_id_service(
    req_id: int, base_session: Session
) -> requisitions.Requisitions:
    return get_requisition_by_id(req_id, base_session)


def create_requisition(
    requisition: RequisitionDTO, base_session: Session
):
    db_requisition = db_model_from_dto(requisition, requisitions.Requisitions)
    return add_new_requisition(db_requisition, base_session)


def get_requisitions_filtered(
    filter: RequisitionFilterDTO, limit: int, offset: int, base_session: Session

) -> List[requisitions.Requisitions]:
    return get_filtered(filter, limit, offset, base_session)

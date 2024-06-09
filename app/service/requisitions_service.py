from sqlalchemy.orm import Session
from db.crud_requisitions import *
from typing import List


def get_requisitions_service(
    limit: int, offset: int, base_session: Session
) -> List[requisitions.Requisitions]:
    return get_everything(limit, offset, base_session)


def get_requisition_by_id_service(
    req_id: int, base_session: Session
) -> requisitions.Requisitions:
    return get_requisition_by_id(req_id, base_session)


def get_passengers_filtered(
    filter: RequisitionFilterDTO, limit: int, offset: int, base_session: Session

) -> List[requisitions.Requisitions]:
    return get_filtered(filter, limit, offset, base_session)

import json

from sqlalchemy.orm import Session
from db.models import requisitions


def get_everything(
        limit: int, offset: int, base_session: Session
):
    requisitions_list = base_session.query(requisitions.Requisitions).limit(limit).offset(offset).all()
    return requisitions_list


def get_requisition_by_id(
        req_id: int, base_session: Session
):
    requisition = base_session.query(requisitions.Requisitions).filter(requisitions.Requisitions.id == req_id).first()
    return requisition

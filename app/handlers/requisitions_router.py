from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.base import get_db
from service import requisitions_service

requisitions_router = APIRouter()


@requisitions_router.get("/")
async def get_requisitions_list(
    limit: int, offset: int, base_session: Session = Depends(get_db)
):
    requisitions = requisitions_service.get_requisitions(limit, offset, base_session)
    return requisitions


@requisitions_router.get("/id")
async def get_requisitions_list(
    req_id: int, base_session: Session = Depends(get_db)
):
    requisition = requisitions_service.get_requisition_by_id_service(req_id, base_session)
    return requisition

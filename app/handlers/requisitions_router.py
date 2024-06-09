from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.base import get_db
from service import requisitions_service
from model.dto.filters import RequisitionFilterDTO
from model.dto.entity import RequisitionDTO
from utils.logger import logger

requisitions_router = APIRouter()


@requisitions_router.get("/")
async def get_requisitions_list(
    limit: int, offset: int, base_session: Session = Depends(get_db)
):
    requisitions = requisitions_service.get_requisitions(limit, offset, base_session)
    return requisitions


@requisitions_router.get("/id")
async def get_requisition_by_id(
    req_id: int, base_session: Session = Depends(get_db)
):
    requisition = requisitions_service.get_requisition_by_id_service(req_id, base_session)
    return requisition


@requisitions_router.post("/filtered")
async def get_requisitions_filtered(
    filter: RequisitionFilterDTO, limit: int, offset: int, base_session: Session = Depends(get_db)
):
    return requisitions_service.get_requisitions_filtered(filter, limit, offset, base_session)


@requisitions_router.post("/")
async def create_requisition(
    requisition: RequisitionDTO, base_session: Session = Depends(get_db)
):
    return requisitions_service.create_requisition(requisition, base_session)

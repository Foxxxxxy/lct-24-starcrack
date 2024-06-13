from typing import Annotated, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.base import get_db
from model.dto.auth_models import UserOutputSchema
from service import requisitions_service, auth_service
from model.dto.filters import RequisitionFilterDTO
from model.dto.entity import RequisitionDTO
from model.dto.update_entity import RequisitionUpdateDTO
requisitions_router = APIRouter()


@requisitions_router.get("/")
async def get_requisitions_list(
    limit: int, offset: int, base_session: Session = Depends(get_db)
) -> List[RequisitionDTO]:
    requisitions = requisitions_service.get_requisitions(limit, offset, base_session)
    return requisitions


@requisitions_router.get("/id")
async def get_requisition_by_id(
    req_id: int, user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)],
        base_session: Session = Depends(get_db)
) -> RequisitionDTO:
    requisition = requisitions_service.get_requisition_by_id_service(req_id, base_session)
    return requisition


@requisitions_router.post("/filtered")
async def get_requisitions_filtered(
    filter: RequisitionFilterDTO, user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)],
        limit: int, offset: int, base_session: Session = Depends(get_db)
) -> List[RequisitionDTO]:
    return requisitions_service.get_requisitions_filtered(filter, limit, offset, base_session)


# дописать
@requisitions_router.post("/update")
async def update_requisitions(
    new_requisition: RequisitionUpdateDTO, user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)],
        base_session: Session = Depends(get_db)
) -> RequisitionDTO:
    return requisitions_service.update_requisition(new_requisition, base_session)


@requisitions_router.post("/")
async def create_requisition(
    requisition: RequisitionDTO, user: Annotated[UserOutputSchema, Depends(auth_service.auth_admin_spec_op)],
        base_session: Session = Depends(get_db)
) -> int:
    return requisitions_service.create_requisition(requisition, base_session)


@requisitions_router.delete("/")
async def delete_requisition(
    requisition_id: int, user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)],
        base_session: Session = Depends(get_db)
):
    requisitions_service.delete_requisition(requisition_id, base_session)

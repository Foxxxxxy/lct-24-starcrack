import datetime
from typing import Annotated, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from algorithms.DijkstraAlgorithm import DijkstraAlgorithm, get_dijkstra_algorithm
from db.base import get_db
from model.dto.auth_models import UserOutputSchema
from model.enum.enums import Status, RoleType
from service import requisitions_service, auth_service
from model.dto.filters import RequisitionFilterDTO
from model.dto.entity import RequisitionDTO, ScheduledRequisitionDTO
from model.dto.update_entity import RequisitionUpdateDTO

requisitions_router = APIRouter()


@requisitions_router.get("/")
async def get_requisitions_list(
        limit: int, offset: int, user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)],
        base_session: Session = Depends(get_db)
) -> List[RequisitionDTO]:
    if user.role == RoleType.Attendant:
        return requisitions_service.get_requisitions_by_employee(user.id, limit, offset, base_session)
    requisitions = requisitions_service.get_requisitions(limit, offset, base_session)
    return requisitions


@requisitions_router.get("/scheduled")
async def get_scheduled_for_date(
        date: datetime.date, user: Annotated[UserOutputSchema, Depends(auth_service.auth_admin_spec_op)],
        base_session: Session = Depends(get_db)
) -> List[ScheduledRequisitionDTO]:
    return requisitions_service.get_scheduled_by_date(date, base_session)


@requisitions_router.get("/id")
async def get_requisition_by_id(
        req_id: int, user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)],
        base_session: Session = Depends(get_db)
) -> RequisitionDTO:
    requisition = requisitions_service.get_requisition_by_id_service(req_id, base_session)
    return requisition


@requisitions_router.post("/filtered")
async def get_requisitions_filtered(
        filter: RequisitionFilterDTO, limit: int, offset: int,
        user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)], base_session: Session = Depends(get_db)
) -> List[RequisitionDTO]:
    return requisitions_service.get_requisitions_filtered(filter, limit, offset, base_session)


@requisitions_router.put("/update-status")
async def update_requisition_status(
        id: int, new_status: Status, user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)],
        base_session: Session = Depends(get_db)
):
    return requisitions_service.update_status_by_id(id, new_status, base_session)


# дописать
@requisitions_router.post("/update")
async def update_requisitions(
        new_requisition: RequisitionUpdateDTO, user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)],
        base_session: Session = Depends(get_db), algorithm: DijkstraAlgorithm = Depends(get_dijkstra_algorithm)
) -> RequisitionDTO:
    return requisitions_service.update_requisition(new_requisition, base_session, algorithm)


@requisitions_router.post("/")
async def create_requisition(
        requisition: RequisitionDTO, user: Annotated[UserOutputSchema, Depends(auth_service.auth_admin_spec_op)],
        base_session: Session = Depends(get_db), algorithm: DijkstraAlgorithm = Depends(get_dijkstra_algorithm)
):
    return requisitions_service.create_requisition(requisition, base_session, algorithm)


@requisitions_router.delete("/")
async def delete_requisition(
        requisition_id: int, user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)],
        base_session: Session = Depends(get_db)
):
    requisitions_service.delete_requisition(requisition_id, base_session)


@requisitions_router.post("/employees")
async def update_employees_for_requisition(
        req_id: int, emp_list: List[int],
        user: Annotated[UserOutputSchema, Depends(auth_service.auth_user)], base_session: Session = Depends(get_db)
):
    return requisitions_service.update_employee_list(req_id, emp_list, base_session)

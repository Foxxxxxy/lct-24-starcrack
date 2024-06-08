from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from db.base import Base


class ExecutorToRequisition(Base):
    __tablename__ = 'Executers_to_requisitions'

    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, ForeignKey('Employees.id'), nullable=False)
    requisition_id = Column(Integer, ForeignKey('Requisitions.id'), nullable=False)

    employee = relationship("Employee")
    requisition = relationship("Requisition")
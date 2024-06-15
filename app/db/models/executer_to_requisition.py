from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from db.base import Base


class ExecutorToRequisition(Base):
    __tablename__ = 'executers_to_requisitions'

    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, ForeignKey('employees.id'), nullable=False)
    requisition_id = Column(Integer, ForeignKey('requisitions.id'), nullable=False)

    employee = relationship("employee")
    requisition = relationship("requisition")
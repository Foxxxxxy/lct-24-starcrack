from sqlalchemy import Column, Integer, TIMESTAMP
from db.base import Base


class Lunch(Base):
    __tablename__ = 'lunch'

    id = Column(Integer, primary_key=True)
    executor_id = Column(Integer, nullable=False)
    shift_id = Column(Integer, nullable=True)
    start_lunch = Column(TIMESTAMP(timezone=True), nullable=False)
    end_lunch = Column(TIMESTAMP(timezone=True), nullable=False)

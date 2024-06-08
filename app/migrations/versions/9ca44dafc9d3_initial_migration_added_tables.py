"""Initial migration - added tables

Revision ID: 9ca44dafc9d3
Revises: 
Create Date: 2024-06-08 14:46:25.773669

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9ca44dafc9d3'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
    CREATE TABLE IF NOT EXISTS "Metro_stations"(
        "id" BIGINT PRIMARY KEY,
        "line_name" VARCHAR(255) NOT NULL,
        "line_id" BIGINT NOT NULL,
        "station_name" VARCHAR(255) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS "Passenger"(
        "id" BIGINT PRIMARY KEY,
        "passenger_category" VARCHAR(255) CHECK ("passenger_category" IN('ИЗТ', 'ИЗ', 'ИС', 'ИК', 'ИО', 'ДИ', 'ПЛ', 'РД', 'РДК', 'ОГД', 'ОВ', 'ИУ')) NOT NULL,
        "name" VARCHAR(255) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS "Employees"(
        "id" BIGINT PRIMARY KEY,
        "full_name" VARCHAR(255) NOT NULL,
        "sex" VARCHAR(255) CHECK ("sex" IN('Male', 'Female')) NOT NULL,
        "rank" VARCHAR(255) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS "Requisitions"(
        "id" BIGINT PRIMARY KEY,
        "passenger_id" BIGINT NOT NULL,
        "start_time" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
        "meet_time" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
        "finish_time" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
        "status" VARCHAR(255) CHECK ("status" IN('Pending', 'Completed', 'Cancelled')) NOT NULL,
        "creation_time" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
        "males_needed" INTEGER NOT NULL,
        "start_station" BIGINT NOT NULL,
        "end_station" BIGINT NOT NULL,
        FOREIGN KEY ("passenger_id") REFERENCES "Passenger"("id"),
        FOREIGN KEY ("start_station") REFERENCES "Metro_stations"("id"),
        FOREIGN KEY ("end_station") REFERENCES "Metro_stations"("id")
    );
    
    CREATE TABLE IF NOT EXISTS "Shifts"(
        "id" BIGINT PRIMARY KEY,
        "employee_id" BIGINT NOT NULL,
        "time_start" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
        "time_end" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
        "place_start" BIGINT NULL,
        "weekday" VARCHAR(255) CHECK ("weekday" IN('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')) NOT NULL,
        FOREIGN KEY ("employee_id") REFERENCES "Employees"("id"),
        FOREIGN KEY ("place_start") REFERENCES "Metro_stations"("id")
    );
    
    CREATE TABLE IF NOT EXISTS "Executers_to_requisitions"(
        "id" BIGINT PRIMARY KEY,
        "employee_id" BIGINT NOT NULL,
        "requisition_id" BIGINT NOT NULL,
        FOREIGN KEY ("requisition_id") REFERENCES "Requisitions"("id"),
        FOREIGN KEY ("employee_id") REFERENCES "Employees"("id")
    );
    """)


def downgrade() -> None:
    op.execute("""
    DROP TABLE IF EXISTS "Executers_to_requisitions";
    """)
    op.execute("""
    DROP TABLE IF EXISTS "Shifts";
    """)
    op.execute("""
    DROP TABLE IF EXISTS "Requisitions";
    """)
    op.exeute("""
    DROP TABLE IF EXISTS "Employees";
    """)
    op.execute("""
    DROP TABLE IF EXISTS "Passenger";
    """)
    op.execute("""
    DROP TABLE IF EXISTS "Metro_stations";
    """)
    op.execute("""
    DROP TYPE IF EXISTS passenger_category;
    """)

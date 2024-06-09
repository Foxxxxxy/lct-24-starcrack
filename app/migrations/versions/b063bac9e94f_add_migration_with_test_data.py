"""add migration with test data

Revision ID: b063bac9e94f
Revises: 59c66907faea
Create Date: 2024-06-09 23:33:26.043055

"""
from pathlib import Path
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b063bac9e94f'
down_revision: Union[str, None] = '59c66907faea'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with open(f"/app/test/test_data/metro_stations.sql", "r") as f:
        op.execute(f.read())

    with open(f"/app/test/test_data/passengers.sql", "r") as f:
        op.execute(f.read())

    with open(f"/app/test/test_data/employees.sql", "r") as f:
        op.execute(f.read())

    with open(f"/app/test/test_data/requisitions.sql", "r") as f:
        op.execute(f.read())


def downgrade() -> None:
    op.execute(
        """
            TRUNCATE TABLE executers_to_requisitions CASCADE;
            
            TRUNCATE TABLE requisitions CASCADE;

            TRUNCATE TABLE employees CASCADE;

            TRUNCATE TABLE passenger CASCADE;

            TRUNCATE TABLE metro_stations CASCADE;
        """
    )

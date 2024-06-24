"""Lunch table

Revision ID: bcfd576f4a25
Revises: b063bac9e94f
Create Date: 2024-06-24 00:07:11.118566

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'bcfd576f4a25'
down_revision: Union[str, None] = 'b063bac9e94f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        CREATE TABLE IF NOT EXISTS lunch (
            id SERIAL PRIMARY KEY,
            executor_id INTEGER,
            shift_id INTEGER,
            start_lunch TIMESTAMP WITH TIME ZONE,
            end_lunch TIMESTAMP WITH TIME ZONE
        );
        ALTER TABLE lunch
        ALTER COLUMN start_lunch TYPE TIMESTAMP WITH TIME ZONE
        USING start_lunch AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Moscow';
        ALTER TABLE lunch
        ALTER COLUMN end_lunch TYPE TIMESTAMP WITH TIME ZONE
        USING end_lunch AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Moscow';
    """)


def downgrade() -> None:
    op.execute("DROP TABLE lunch")


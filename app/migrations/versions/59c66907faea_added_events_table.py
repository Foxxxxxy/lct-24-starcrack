"""Added events table

Revision ID: 59c66907faea
Revises: 9ca44dafc9d3
Create Date: 2024-06-08 15:45:37.748273

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '59c66907faea'
down_revision: Union[str, None] = '9ca44dafc9d3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
    CREATE TYPE event_type AS ENUM ('DYNAMIC_SCHEDULE_REQUEST', 'UNSCHEDULED_REQUEST');

    CREATE TYPE criticality AS ENUM ('CRITICAL', 'WARNING', 'NORMAL');

    CREATE TABLE IF NOT EXISTS Event (
    id BIGSERIAL PRIMARY KEY,
    type event_type NOT NULL,
    data JSONB NOT NULL,
    criticality criticality NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now()
    );
    """)


def downgrade() -> None:
    op.execute("""
    DROP TABLE IF EXISTS "event";
    """)
    op.execute("""
    DROP TYPE IF EXISTS criticality;
    """)
    op.execute("""
    DROP TYPE IF EXISTS event_type;
    """)

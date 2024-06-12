"""update statuses

Revision ID: 0797b08d031f
Revises: b063bac9e94f
Create Date: 2024-06-12 21:30:46.506568

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0797b08d031f'
down_revision: Union[str, None] = 'b063bac9e94f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TYPE status_type ADD VALUE 'INSPECTOR_EN_ROUTE';
        ALTER TYPE status_type ADD VALUE 'INSPECTOR_ARRIVED';
        ALTER TYPE status_type ADD VALUE 'REJECTED';
        ALTER TYPE status_type ADD VALUE 'PASSENGER_LATE';
        ALTER TYPE status_type ADD VALUE 'INSPECTOR_LATE';
        """
    )


def downgrade() -> None:
    pass

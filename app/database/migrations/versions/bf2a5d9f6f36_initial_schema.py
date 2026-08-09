"""Initial schema

Revision ID: bf2a5d9f6f36
Revises:
Create Date: 2026-06-29 13:23:55.923777
"""

from typing import Sequence, Union

from alembic import op

from app.database.base import Base
from app.models import *


# revision identifiers, used by Alembic.
revision: str = "bf2a5d9f6f36"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create the initial database schema."""

    bind = op.get_bind()

    Base.metadata.create_all(bind=bind)


def downgrade() -> None:
    """Drop the initial database schema."""

    bind = op.get_bind()

    Base.metadata.drop_all(bind=bind)
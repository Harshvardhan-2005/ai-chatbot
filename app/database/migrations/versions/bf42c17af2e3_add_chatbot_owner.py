"""Add chatbot owner

Revision ID: bf42c17af2e3
Revises: bf2a5d9f6f36
Create Date: 2026-06-30 10:28:10.643896
"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "bf42c17af2e3"
down_revision: Union[str, Sequence[str], None] = "bf2a5d9f6f36"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Chatbot owner is already included in the initial schema."""
    pass


def downgrade() -> None:
    """Nothing to downgrade."""
    pass
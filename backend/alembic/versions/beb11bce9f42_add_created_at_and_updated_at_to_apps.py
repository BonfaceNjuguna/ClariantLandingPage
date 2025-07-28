"""add created_at and updated_at to apps

Revision ID: beb11bce9f42
Revises: b662936e4c54
Create Date: 2025-07-28 20:43:51.317040

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'beb11bce9f42'
down_revision: Union[str, Sequence[str], None] = 'b662936e4c54'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('apps', sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')))
    op.add_column('apps', sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')))

def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('apps', 'created_at')
    op.drop_column('apps', 'updated_at')

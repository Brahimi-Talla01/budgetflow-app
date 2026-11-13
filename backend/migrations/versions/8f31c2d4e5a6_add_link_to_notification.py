"""Add link to notification

Revision ID: 8f31c2d4e5a6
Revises: 47cc39500a0c
Create Date: 2026-11-13 12:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8f31c2d4e5a6'
down_revision = '47cc39500a0c'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('notification', schema=None) as batch_op:
        batch_op.add_column(sa.Column('link', sa.String(length=255), nullable=True))


def downgrade():
    with op.batch_alter_table('notification', schema=None) as batch_op:
        batch_op.drop_column('link')

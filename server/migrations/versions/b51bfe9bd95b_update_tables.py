"""update tables

Revision ID: b51bfe9bd95b
Revises: 0196c6fa4ecd
Create Date: 2023-07-09 04:01:28.460609

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b51bfe9bd95b'
down_revision = '0196c6fa4ecd'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('items', sa.Column('description', sa.Text(), nullable=False))
    op.add_column('items', sa.Column('price', sa.Float(), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('items', 'price')
    op.drop_column('items', 'description')
    # ### end Alembic commands ###
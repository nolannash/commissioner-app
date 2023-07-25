"""changes to FormItem

Revision ID: 9bc55c197bfb
Revises: 0dc49fa35ed1
Create Date: 2023-07-15 17:55:29.365523

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9bc55c197bfb'
down_revision = '0dc49fa35ed1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('form_items', sa.Column('seller_question', sa.String(), nullable=True))
    op.drop_column('form_items', 'options')
    op.drop_column('form_items', 'component_type')
    op.add_column('orders', sa.Column('user_response', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('orders', 'user_response')
    op.add_column('form_items', sa.Column('component_type', sa.VARCHAR(), nullable=False))
    op.add_column('form_items', sa.Column('options', sa.VARCHAR(), nullable=True))
    op.drop_column('form_items', 'seller_question')
    # ### end Alembic commands ###
"""update bio for sellers and validations for email/shopname/username changes

Revision ID: 4e52e1ce344b
Revises: 25f9a47b69e4
Create Date: 2023-07-12 23:37:36.273684

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4e52e1ce344b'
down_revision = '25f9a47b69e4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('sellers', sa.Column('bio', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('sellers', 'bio')
    # ### end Alembic commands ###

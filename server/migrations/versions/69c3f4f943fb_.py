"""empty message

Revision ID: 69c3f4f943fb
Revises: 41dcf3aeac4b
Create Date: 2023-07-18 14:34:15.168937

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '69c3f4f943fb'
down_revision = '41dcf3aeac4b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('favorites', schema=None) as batch_op:
        batch_op.drop_constraint('fk_favorites_shop_id_sellers', type_='foreignkey')
        batch_op.drop_column('shop_id')

    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_response', sa.String(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.drop_column('user_response')

    with op.batch_alter_table('favorites', schema=None) as batch_op:
        batch_op.add_column(sa.Column('shop_id', sa.INTEGER(), nullable=True))
        batch_op.create_foreign_key('fk_favorites_shop_id_sellers', 'sellers', ['shop_id'], ['id'])

    # ### end Alembic commands ###
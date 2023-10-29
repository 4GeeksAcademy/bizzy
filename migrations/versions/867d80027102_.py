"""empty message

Revision ID: 867d80027102
Revises: b7ee45f0594c
Create Date: 2023-10-29 09:52:47.555829

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '867d80027102'
down_revision = 'b7ee45f0594c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('customer', schema=None) as batch_op:
        batch_op.alter_column('email',
               existing_type=sa.VARCHAR(length=40),
               type_=sa.String(length=80),
               nullable=True)
        batch_op.alter_column('phone',
               existing_type=sa.VARCHAR(length=40),
               nullable=True)
        batch_op.drop_constraint('customer_name_key', type_='unique')
        batch_op.drop_constraint('customer_username_key', type_='unique')
        batch_op.drop_column('username')

    with op.batch_alter_table('order', schema=None) as batch_op:
        batch_op.add_column(sa.Column('date', sa.String(length=50), nullable=False))

    with op.batch_alter_table('payment', schema=None) as batch_op:
        batch_op.add_column(sa.Column('icon', sa.String(length=400), nullable=False))

    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.alter_column('image',
               existing_type=sa.VARCHAR(length=200),
               type_=sa.String(length=400),
               existing_nullable=False)

    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('name', sa.String(length=40), nullable=False))
        batch_op.add_column(sa.Column('active', sa.Boolean(), nullable=False))
        batch_op.alter_column('email',
               existing_type=sa.VARCHAR(length=120),
               type_=sa.String(length=80),
               existing_nullable=False)
        batch_op.alter_column('password',
               existing_type=sa.VARCHAR(length=80),
               type_=sa.String(length=30),
               existing_nullable=False)
        batch_op.drop_column('role')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('role', sa.VARCHAR(length=15), autoincrement=False, nullable=False))
        batch_op.alter_column('password',
               existing_type=sa.String(length=30),
               type_=sa.VARCHAR(length=80),
               existing_nullable=False)
        batch_op.alter_column('email',
               existing_type=sa.String(length=80),
               type_=sa.VARCHAR(length=120),
               existing_nullable=False)
        batch_op.drop_column('active')
        batch_op.drop_column('name')

    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.alter_column('image',
               existing_type=sa.String(length=400),
               type_=sa.VARCHAR(length=200),
               existing_nullable=False)

    with op.batch_alter_table('payment', schema=None) as batch_op:
        batch_op.drop_column('icon')

    with op.batch_alter_table('order', schema=None) as batch_op:
        batch_op.drop_column('date')

    with op.batch_alter_table('customer', schema=None) as batch_op:
        batch_op.add_column(sa.Column('username', sa.VARCHAR(length=40), autoincrement=False, nullable=False))
        batch_op.create_unique_constraint('customer_username_key', ['username'])
        batch_op.create_unique_constraint('customer_name_key', ['name'])
        batch_op.alter_column('phone',
               existing_type=sa.VARCHAR(length=40),
               nullable=False)
        batch_op.alter_column('email',
               existing_type=sa.String(length=80),
               type_=sa.VARCHAR(length=40),
               nullable=False)

    # ### end Alembic commands ###

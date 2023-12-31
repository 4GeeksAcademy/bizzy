"""empty message

Revision ID: 83f11586d5ef
Revises: ab3d5288f08a
Create Date: 2023-11-21 19:37:00.485969

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '83f11586d5ef'
down_revision = 'ab3d5288f08a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('password',
               existing_type=sa.VARCHAR(length=80),
               type_=sa.String(length=200),
               existing_nullable=False)
        batch_op.alter_column('salt',
               existing_type=sa.VARCHAR(length=40),
               type_=sa.String(length=50),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('salt',
               existing_type=sa.String(length=50),
               type_=sa.VARCHAR(length=40),
               existing_nullable=False)
        batch_op.alter_column('password',
               existing_type=sa.String(length=200),
               type_=sa.VARCHAR(length=80),
               existing_nullable=False)

    # ### end Alembic commands ###

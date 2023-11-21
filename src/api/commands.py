
import click
import bcrypt
from api.models import db, User

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
def setup_commands(app):
    
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("create-superadmin") # name of our command
    def create_superadmin():
        print("Creating superadmin...")
        password = "superadmin"
        bpassword = bytes(password, 'utf-8')
        salt = bcrypt.gensalt(14)
        hashed_password = bcrypt.hashpw(password=bpassword, salt=salt)

        user = User("admin", "superadmin@bizzy.com", hashed_password.decode('utf-8'), salt.decode('utf-8'), True, True)
        user.name = "admin"
        user.email = "superadmin@bizzy.com"
        user.password = hashed_password.decode('utf-8')
        user.salt = salt.decode('utf-8')
        user.is_active = False
        user.admin = True


        db.session.add(user)
        db.session.commit()

        print("superadmin created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        pass
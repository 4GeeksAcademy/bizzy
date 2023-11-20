
import click
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
        user = User("admin", "superadmin", "superadmin@bizzy.com", "superadmin", True, True)
        user.name = "admin"
        user.username = "superadmin"
        user.email = "superadmin@bizzy.com"
        user.password = "superadmin"
        user.is_active = False
        user.admin = True

        db.session.add(user)
        db.session.commit()

        print("superadmin created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        pass
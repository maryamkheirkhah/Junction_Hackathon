import random
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.sql import func

# Define Base and User directly in the script
Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True)
    username = Column(Text, unique=True, nullable=False)
    email = Column(Text, unique=True, nullable=False)
    password = Column(Text, nullable=False)
    role = Column(Text, nullable=False)
    sub_role = Column(Text)
    created_at = Column(DateTime, server_default=func.now())


# Database setup
DATABASE_PATH = '../tickets.db'
engine = create_engine(f'sqlite:///{DATABASE_PATH}')
Session = sessionmaker(bind=engine)
session = Session()

# Define sub_roles for client users
sub_roles = ['softwaredeveloper', 'productmanager', 'expert', None]

# Set common password and sample data for generating usernames and emails
common_password = "admin"
username_prefixes = ["alex", "beth", "chris", "dana",
                     "erin", "faye", "gabe", "hank", "ivy", "jill"]
email_domains = ["example.com", "mail.com", "test.com"]

# Create 1 admin user
admin_user = User(
    username="admin",  # fixed username for the admin
    email=f"admin@{random.choice(email_domains)}",
    password=common_password,
    role='admin',
    sub_role=None
)
session.add(admin_user)

# Generate and insert 9 client users with unique usernames and emails
for i in range(9):
    # using a unique username from the predefined list
    username = username_prefixes[i]
    email = f"{username}@{random.choice(email_domains)}"
    client_user = User(
        username=username,
        email=email,
        password=common_password,
        role='client',
        sub_role=random.choice(sub_roles)
    )
    session.add(client_user)

# Commit the changes to the database
session.commit()
print("1 admin and 9 client users have been added to the database with 'admin' as the password.")

# Close the session
session.close()

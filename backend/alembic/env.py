from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
from app.models import Base  # Import your models

# this is the Alembic Config object
config = context.config

# ... other existing code ...

target_metadata = Base.metadata  # Set your models metadata

# ... rest of the file remains unchanged ... 
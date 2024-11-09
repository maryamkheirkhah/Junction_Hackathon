import os
from sqlalchemy import inspect
from database import engine
import models

def ensure_schema():
    # Create database if it doesn't exist
    if not os.path.exists("tickets.db"):
        models.Base.metadata.create_all(bind=engine)
        print("Database created with initial schema")
        return
    
    # Check if all tables exist
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    required_tables = [
        "users", "tickets", "stages", "comments", 
        "subscriptions", "notifications"
    ]
    
    missing_tables = [table for table in required_tables 
                     if table not in existing_tables]
    
    if missing_tables:
        print(f"Missing tables found: {missing_tables}")
        models.Base.metadata.create_all(bind=engine)
        print("Schema updated")
    else:
        print("Schema is up to date")

if __name__ == "__main__":
    ensure_schema() 
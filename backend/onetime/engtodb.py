import pandas as pd
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from datetime import datetime
from ..app.database import Base, engine
from ..app.models import Ticket

#### THIS SCRIPT WAS PART OF APP FOLDER BEFORE, PORT BACK BEFORE RUNNING

# Load Excel data
file_path = './data/english_translation.xlsx'  # Update this path as needed

# Load the specified sheet and rename columns
df = pd.read_excel(file_path, sheet_name='SuggestionForImprovement', skiprows=1, nrows=420)

# Define a mapping for complex column names to simpler ones
column_mapping = {
    'x': 'ID',
    'x.1': 'Planned_release_version',
    'x.2': 'State',
    'Description of what the requested change concerns.': 'Development_proposal',
    'Unnamed: 4': 'Clarification_original',
    'Previous column in English': 'Clarification_english',
    'Unnamed: 6': 'Resolution_description',
    'Previous column in English.1': 'Resolution_description_english',
    'Because the amendment proposal has been submitted.': 'Raised_date',
    'Unnamed: 9': 'Functional_area',
    'Where is the proposal for change coming from': 'Product_improvement',
    'Unnamed: 11': 'Priority',
    'Unnamed: 12': 'Arguments_for_proposal',
    'Unnamed: 13': 'Comment',
    'x.3': 'Impact_of_proposal',
    'Why is change needed, what are the concrete impacts if the change is not made (costs/additional work, etc.)?': 'Impact_description',
    'Unnamed: 16': 'Commissioning_actions',
    'How does the change affect current definitions.': 'Impact_effect',
    'Unnamed: 18': 'Completion_date',
    'Unnamed: 19': 'Recommendation',
    'Because the matter has been addressed, for example, in the process working group': 'Next_steps',
    'The decision on how to proceed with the change, whether to take action or refrain from doing so. Who made the decision.': 'Decision_maker',
    'How will the matter be advanced, for example, is a review by the process workgroup sufficient, or does it require a broader survey from the industry?': 'Advancement_plan'
}

# Rename columns in the DataFrame
df_renamed = df.rename(columns=column_mapping)

# Database setup
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
session = SessionLocal()

# Helper to handle optional values
def get_optional(value):
    return value if pd.notnull(value) else None

# Function to parse Excel date format with default for NULL cases
def parse_excel_date(serial, default_date=None):
    try:
        return datetime.fromordinal(datetime(1900, 1, 1).toordinal() + int(serial) - 2)
    except (ValueError, TypeError):
        return default_date

# Default date (e.g., the current date) if raised_date is required but missing
default_raised_date = datetime.now()

# Insert data into database
for _, row in df_renamed.iterrows():
    ticket = Ticket(
        title=row.get('Development_proposal'),
        description=row.get('Clarification_original'),
        state=row.get('State'),
        priority=get_optional(row.get('Priority')),
        impact=row.get('Impact_of_proposal'),
        requires_action=(row.get('Commissioning_actions') == 'Yes'),
        planned_release_version=get_optional(row.get('Planned_release_version')),
        resolution_description=get_optional(row.get('Resolution_description')),
        recommendation=get_optional(row.get('Recommendation')),
        next_steps=get_optional(row.get('Next_steps')),
        functional_area=get_optional(row.get('Functional_area')),
        product_improvement=(row.get('Product_improvement') == 'Yes'),
        raised_date=parse_excel_date(row.get('Raised_date'), default_date=default_raised_date),
        completion_date=parse_excel_date(row.get('Completion_date')) if pd.notnull(row.get('Completion_date')) else None
    )

    session.add(ticket)

# Commit all changes to the database
session.commit()
session.close()

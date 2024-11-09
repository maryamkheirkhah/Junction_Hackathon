import sqlite3
import time
import os
from typing import Dict, Any
from pydantic import BaseModel
from openai import OpenAI

from dotenv import load_dotenv
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class TicketTitle(BaseModel):
    title: str
    reasoning: str  # Optional field to understand why this title was chosen


def connect_to_db() -> sqlite3.Connection:
    """Create a connection to the SQLite database."""
    return sqlite3.connect('../../backend/tickets.db')


def get_completion(prompt: str) -> TicketTitle:
    """Get structured completion from OpenAI API with retry logic."""
    max_retries = 3
    for attempt in range(max_retries):
        try:
            completion = client.beta.chat.completions.parse(
                model="gpt-4o-2024-08-06",  # Using the latest available model
                messages=[{
                    "role": "system",
                    "content": "You are a helpful assistant that creates concise ticket titles. "
                    "Generate a title that captures the essence of the ticket in exactly 52 characters or less. "
                    "We are creating a system where people can submit issue tickets as well as request new features. "
                    "Please ensure the title is clear and actionable. Thus, avoid titles like 'Feature Request' or 'Issue Report'."
                    "The idea is user should be easily able to understand the purpose of the ticket at a glance and decide whether to check the complete ticket content or not."
                    "Also provide brief reasoning for the chosen title."
                }, {
                    "role": "user",
                    "content": prompt
                }],
                response_format=TicketTitle,
            )
            return completion.choices[0].message.parsed
        except Exception as e:
            if attempt == max_retries - 1:
                raise e
            time.sleep(2 ** attempt)  # Exponential backoff


def create_title_prompt(ticket: Dict[str, Any]) -> str:
    """Create a prompt for the LLM based on ticket information."""
    return f"""
Analyze the following ticket information from our database and create a concise, meaningful title.
Each piece of information comes from a specific database column in our 'tickets' table:

FROM 'description' COLUMN:
{ticket['description']}

FROM 'clarification' COLUMN:
{ticket['clarification']}

FROM 'status' COLUMN:
{ticket['status']}

FROM 'priority' COLUMN:
{ticket['priority']}

FROM 'category' COLUMN:
{ticket['category']}

Requirements for generating the title:
1. Title must be 52 characters or less (this is critical for our UI)
2. Title should capture the main issue or purpose by considering ALL provided columns
3. Title should be clear and actionable
4. Use proper capitalization
"""


def update_ticket_titles():
    """Main function to update ticket titles in the database."""
    conn = connect_to_db()
    cursor = conn.cursor()

    try:
        # Updated query to use ticket_id instead of id
        cursor.execute("""
            SELECT ticket_id, description, clarification, state as status, priority, functional_area as category
            FROM tickets
        """)

        # Convert to dictionary for easier handling
        columns = [col[0] for col in cursor.description]
        tickets = [dict(zip(columns, row)) for row in cursor.fetchall()]

        # Process each ticket
        for ticket in tickets:
            print(f"\nProcessing ticket {ticket['ticket_id']}...")  # Updated to use ticket_id

            # Generate title using LLM
            prompt = create_title_prompt(ticket)
            response = get_completion(prompt)

            # Ensure title length is <= 52 characters
            title = response.title
            if len(title) > 52:
                title = title[:49] + "..."

            # Updated query to use ticket_id
            cursor.execute("""
                UPDATE tickets
                SET ticket_title = ?
                WHERE ticket_id = ?
            """, (title, ticket['ticket_id']))

            conn.commit()
            print(f"Updated ticket {ticket['ticket_id']}:")  # Updated to use ticket_id
            print(f"Title: {title}")
            print(f"Reasoning: {response.reasoning}")

            # Small delay to avoid rate limits
            time.sleep(0.5)

    except Exception as e:
        print(f"An error occurred: {e}")
        conn.rollback()
    finally:
        conn.close()


if __name__ == "__main__":
    update_ticket_titles()

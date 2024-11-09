import sqlite3
import time
import os
import logging
from typing import Optional
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Set up logging
logging.basicConfig(
    filename='meeting_id_extraction.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class MeetingExtraction(BaseModel):
    meeting_id: Optional[int] = None
    reasoning: str


def connect_to_db() -> sqlite3.Connection:
    """Create a connection to the SQLite database."""
    return sqlite3.connect('../../backend/tickets.db')


def get_completion(prompt: str) -> MeetingExtraction:
    """Get structured completion from OpenAI API with retry logic."""
    max_retries = 3
    for attempt in range(max_retries):
        try:
            completion = client.beta.chat.completions.parse(
                model="gpt-4o-2024-08-06",
                messages=[{
                    "role": "system",
                    "content": "You are a helpful assistant that extracts meeting IDs from text. "
                    "If the text contains the word 'meeting' and a number that appears to be a meeting ID, extract it. "
                    "If multiple numbers exist, use context to determine which is the meeting ID. "
                    "If no meeting ID is found or if the text doesn't mention a meeting, return null. "
                    "Always provide reasoning for your decision."
                }, {
                    "role": "user",
                    "content": prompt
                }],
                response_format=MeetingExtraction,
            )
            return completion.choices[0].message.parsed
        except Exception as e:
            if attempt == max_retries - 1:
                raise e
            time.sleep(2 ** attempt)


def create_extraction_prompt(state_text: str) -> str:
    """Create a prompt for the LLM to extract meeting ID."""
    return f"""
Please analyze the following text and extract the meeting ID if present:

{state_text}

Requirements:
1. If the text contains the word 'meeting' and a number that appears to be a meeting ID, extract that number
2. If multiple numbers exist, use context to determine which is the meeting ID
3. If no meeting ID is found or if text doesn't mention a meeting, return null
4. Provide reasoning for your decision

Example texts and expected behavior:
- "Rejected (meeting 2)" → meeting_id: 2
- "Recommendation 1 not ok (meeting 11)" → meeting_id: 11
- "Issue resolved in sprint 42" → meeting_id: null
- "No meeting mentioned" → meeting_id: null
- "Development proposal, meeting 16?" → meeting_id: 16
"""


def update_meeting_ids():
    """Main function to update meeting IDs in the database."""
    conn = connect_to_db()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT ticket_id, state
            FROM tickets
            WHERE meeting_id IS NULL
        """)

        tickets = cursor.fetchall()
        logging.info(f"Found {len(tickets)} tickets to process")

        for ticket_id, state in tickets:
            log_msg = f"\nProcessing ticket {ticket_id}..."
            print(log_msg)
            logging.info(log_msg)

            if not state or 'meeting' not in state.lower():
                skip_msg = f"Skipping ticket {ticket_id}: No mention of meeting"
                print(skip_msg)
                logging.info(skip_msg)
                continue

            prompt = create_extraction_prompt(state)
            response = get_completion(prompt)

            if response.meeting_id is not None:
                cursor.execute("""
                    UPDATE tickets
                    SET meeting_id = ?
                    WHERE ticket_id = ?
                """, (response.meeting_id, ticket_id))

                conn.commit()
                update_msg = (
                    f"Updated ticket {ticket_id}:\n"
                    f"State text: {state}\n"
                    f"Meeting ID: {response.meeting_id}\n"
                    f"Reasoning: {response.reasoning}"
                )
                print(update_msg)
                logging.info(update_msg)
            else:
                skip_msg = (
                    f"No meeting ID found for ticket {ticket_id}\n"
                    f"State text: {state}\n"
                    f"Reasoning: {response.reasoning}"
                )
                print(skip_msg)
                logging.info(skip_msg)

            time.sleep(0.5)  # Small delay to avoid rate limits

    except Exception as e:
        error_msg = f"An error occurred: {e}"
        print(error_msg)
        logging.error(error_msg)
        conn.rollback()
    finally:
        conn.close()


if __name__ == "__main__":
    update_meeting_ids()

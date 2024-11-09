import sqlite3


def update_state_text():
    # Connect to the database
    conn = sqlite3.connect('../tickets.db')
    cursor = conn.cursor()

    try:
        # First, get all rows where state contains either 'Tuple' or 'Duplex'
        cursor.execute(
            "SELECT ticket_id, state FROM tickets WHERE state LIKE '%Tuple%' OR state LIKE '%Duplex%'")
        rows = cursor.fetchall()

        # Update each matching row
        for row in rows:
            ticket_id, state = row
            # Replace both 'Tuple' and 'Duplex' with 'Duplicate'
            new_state = state.replace(
                'Tuple', 'Duplicate').replace('Duplex', 'Duplicate')

            # Update the database
            cursor.execute(
                "UPDATE tickets SET state = ? WHERE ticket_id = ?", (new_state, ticket_id))
            print(f"Updated row {ticket_id}: {state} -> {new_state}")

        # Commit the changes
        conn.commit()
        print("Database update completed successfully!")

    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
        conn.rollback()

    finally:
        # Close the connection
        conn.close()


if __name__ == "__main__":
    print("Starting database update...")
    update_state_text()

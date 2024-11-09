# Python Backend

A simplified FastAPI backend with SQLite database for rapid development.

## Setup

1. Install dependencies:

## To run the app

```bash
cd backend
uvicorn app.main:app --reload
```

## Tested in Postman

1. Start the server: uvicorn app.main:app --reload
2. Test the endpoints in Postman:
   - GET http://localhost:8000/tickets/1
   - GET http://localhost:8000/tickets/
   - POST http://localhost:8000/tickets/
   - PUT http://localhost:8000/tickets/1
   - DELETE http://localhost:8000/tickets/1

For POST requests, use a JSON body like:

```json
{
  "description": "Test ticket",
  "state": "open",
  "priority": 1,
  "impact": "low",
  "requires_action": true,
  "ticket_title": "Test Ticket"
}
```

## Warning: One time operations that do not need to be repeated

```bash
cd backend
python -m app.engtodb
```

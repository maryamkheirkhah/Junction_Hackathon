# Ticket Management System API

A professional B2B ticket management system built with FastAPI and SQLite.

## Features

- Full CRUD operations for tickets
- Advanced search and filtering
- Analytics and reporting
- Comment management
- Subscription system
- Notification handling
- Export functionality

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

## API Endpoints

### Ticket Management

#### Basic Operations
- `GET /tickets/{ticket_id}` - Get specific ticket details
- `GET /tickets/` - List all tickets (with pagination)
- `POST /tickets/` - Create a new ticket
- `PUT /tickets/{ticket_id}` - Update existing ticket
- `DELETE /tickets/{ticket_id}` - Delete a ticket

#### Advanced Features
- `GET /tickets/search/` - Search tickets with filters
- `GET /analytics/tickets/by-state` - Get ticket statistics by state
- `GET /analytics/tickets/resolution-time` - Get resolution time analytics
- `GET /tickets/export` - Export tickets data

### Comments and Subscriptions
- `POST /tickets/{ticket_id}/comments/` - Add comment to ticket
- `GET /tickets/{ticket_id}/comments/` - Get ticket comments
- `POST /tickets/{ticket_id}/subscribe` - Subscribe to ticket updates
- `DELETE /tickets/{ticket_id}/unsubscribe` - Unsubscribe from ticket

### Notifications
- `GET /notifications/` - Get user notifications
- `PUT /notifications/{notification_id}/mark-read` - Mark notification as read

## Request Examples

### Create Ticket

```json
POST /tickets/
{
    "description": "Feature request: Add export functionality",
    "state": "open",
    "priority": 2,
    "impact": "medium",
    "requires_action": true,
    "ticket_title": "Export Feature",
    "functional_area": "Reporting",
    "product_improvement": true
}
```

### Update Ticket
```json
PUT /tickets/{ticket_id}
{
    "state": "in_progress",
    "priority": 1,
    "next_steps": "Schedule technical review",
    "resolution_description": "Implementation planned for next sprint"
}
```

### Search Tickets
```
GET /tickets/search/?query=export&state=open&priority=2&functional_area=Reporting
```

## Response Examples

### Ticket Response
```json
{
    "ticket_id": 1,
    "description": "Feature request: Add export functionality",
    "state": "open",
    "priority": 2,
    "impact": "medium",
    "raised_date": "2024-03-20T10:00:00",
    "created_by": 1,
    "ticket_title": "Export Feature",
    "functional_area": "Reporting",
    "product_improvement": true
}
```

## Development Notes

- The API uses SQLite for development; consider PostgreSQL for production
- Authentication is currently simplified for testing
- All dates are in ISO 8601 format
- Pagination is available on list endpoints (skip/limit parameters)

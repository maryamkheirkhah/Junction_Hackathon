from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from . import crud, models, schemas
from .database import engine, get_db
from .ensure_schema import ensure_schema
from contextlib import asynccontextmanager
from openai import OpenAI
import os


@asynccontextmanager
async def lifespan(app: FastAPI):
    ensure_schema()
    yield

app = FastAPI(lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    # Replace * with your frontend URL
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Ensure the database tables are created
models.Base.metadata.create_all(bind=engine)

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

print(os.getenv('OPENAI_API_KEY'))


@app.get("/tickets/{ticket_id}", response_model=schemas.Ticket)
async def read_ticket(ticket_id: int, db: Session = Depends(get_db)):
    """
    Get a specific ticket by its ID.
    - ticket_id: Unique identifier of the ticket
    - Returns: Detailed ticket information including all fields
    """
    db_ticket = crud.get_ticket(db, ticket_id)
    if db_ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return db_ticket


@app.get("/tickets/", response_model=List[schemas.Ticket])
async def read_tickets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Get a list of tickets with pagination support.
    - skip: Number of records to skip (default: 0)
    - limit: Maximum number of records to return (default: 100)
    - Returns: List of tickets
    """
    tickets = crud.get_tickets(db, skip=skip, limit=limit)
    return tickets


@app.post("/tickets/", response_model=schemas.Ticket)
async def create_ticket(ticket: schemas.TicketCreate, db: Session = Depends(get_db)):
    """
    Create a new ticket in the system.
    - Requires ticket details in request body
    - Returns: Created ticket with assigned ID
    """
    # For testing purposes, using user_id=1. In production, this should come from authentication
    return crud.create_ticket(db=db, ticket=ticket, user_id=1)


@app.put("/tickets/{ticket_id}", response_model=schemas.Ticket)
async def update_ticket(ticket_id: int, ticket: schemas.TicketUpdate, db: Session = Depends(get_db)):
    """
    Update an existing ticket.
    - ticket_id: ID of ticket to update
    - Requires update fields in request body
    - Returns: Updated ticket information
    """
    db_ticket = crud.update_ticket(
        db=db, ticket_id=ticket_id, ticket_update=ticket)
    if db_ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return db_ticket


@app.delete("/tickets/{ticket_id}")
async def delete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    """
    Delete a specific ticket.
    - ticket_id: ID of ticket to delete
    - Returns: Success message or 404 if not found
    """
    success = crud.delete_ticket(db=db, ticket_id=ticket_id)
    if not success:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return {"message": "Ticket deleted successfully"}


@app.post("/tickets/{ticket_id}/stages/", response_model=schemas.Stage)
def create_ticket_stage(
    ticket_id: int,
    stage: schemas.StageCreate,
    db: Session = Depends(get_db)
):
    return crud.create_stage(db=db, stage=stage)


@app.get("/tickets/{ticket_id}/stages/", response_model=List[schemas.Stage])
def read_ticket_stages(ticket_id: int, db: Session = Depends(get_db)):
    return crud.get_ticket_stages(db=db, ticket_id=ticket_id)


@app.get("/tickets/search/", response_model=List[schemas.Ticket])
async def search_tickets(
    query: str,
    state: Optional[str] = None,
    priority: Optional[int] = None,
    functional_area: Optional[str] = None,
    created_after: Optional[datetime] = None,
    created_before: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    """
    Search tickets with various filters.
    - query: Search text
    - state: Filter by ticket state
    - priority: Filter by priority level
    - functional_area: Filter by functional area
    - created_after/before: Date range filters
    - Returns: List of matching tickets
    """
    return crud.search_tickets(db, query, state, priority, functional_area, created_after, created_before)


@app.put("/tickets/bulk/update", response_model=List[schemas.Ticket])
def bulk_update_tickets(
    ticket_ids: List[int],
    update: schemas.TicketUpdate,
    db: Session = Depends(get_db)
):
    return crud.bulk_update_tickets(db, ticket_ids, update)


@app.get("/analytics/tickets/by-state")
def get_tickets_by_state(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    return crud.get_ticket_stats_by_state(db, start_date, end_date)


@app.get("/analytics/tickets/resolution-time")
def get_ticket_resolution_times(
    functional_area: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return crud.get_ticket_resolution_stats(db, functional_area)


@app.post("/tickets/{ticket_id}/subscribe", response_model=schemas.Subscription)
def subscribe_to_ticket(
    ticket_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    return crud.create_subscription(db=db, ticket_id=ticket_id, user_id=user_id)


@app.delete("/tickets/{ticket_id}/unsubscribe")
def unsubscribe_from_ticket(
    ticket_id: int,
    db: Session = Depends(get_db)
):
    return crud.remove_subscription(db, ticket_id)


@app.post("/tickets/{ticket_id}/comments/", response_model=schemas.Comment)
def create_comment(
    ticket_id: int,
    comment: schemas.CommentCreate,
    user_id: int,
    db: Session = Depends(get_db)
):
    return crud.create_ticket_comment(db=db, comment=comment, user_id=user_id)


@app.get("/tickets/{ticket_id}/comments/", response_model=List[schemas.Comment])
def get_ticket_comments(
    ticket_id: int,
    db: Session = Depends(get_db)
):
    return crud.get_ticket_comments(db, ticket_id)


@app.get("/notifications/", response_model=List[schemas.Notification])
def get_user_notifications(
    unread_only: bool = False,
    db: Session = Depends(get_db)
):
    return crud.get_user_notifications(db, unread_only)


@app.put("/notifications/{notification_id}/mark-read")
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db)
):
    return crud.mark_notification_read(db, notification_id)


@app.get("/tickets/export")
def export_tickets(
    format: str = "csv",
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    return crud.export_tickets(db, format, start_date, end_date)


@app.get("/tickets/{ticket_id}/history", response_model=List[schemas.TicketHistory])
def get_ticket_history(
    ticket_id: int,
    db: Session = Depends(get_db)
):
    return crud.get_ticket_history(db, ticket_id)


@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user.
    - Checks for existing email to prevent duplicates
    - Returns: Created user information
    """
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    """
    Get user details by ID.
    - Returns: User information or 404 if not found
    """
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.get("/tickets/user/{user_id}", response_model=List[schemas.Ticket])
def read_user_tickets(
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all tickets for a specific user.
    - Includes pagination support
    - Returns: List of user's tickets
    """
    tickets = crud.get_user_tickets(
        db, user_id=user_id, skip=skip, limit=limit)
    return tickets


# return hello world on home page
@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/login")
def login(
    password: str = Body(...),
    email: str | None = Body(default=None),
    username: str | None = Body(default=None),
    usernameOrEmail: str | None = Body(default=None),
    db: Session = Depends(get_db)
):
    """
    Simple login endpoint that checks email/username and password
    Supports three formats:
    1. {email, password}
    2. {username, password}
    3. {usernameOrEmail, password}
    """
    user = None

    # Handle the usernameOrEmail case
    if usernameOrEmail:
        # Try as email first
        user = crud.get_user_by_email(db, usernameOrEmail)
        # If not found, try as username
        if not user:
            user = crud.get_user_by_username(db, usernameOrEmail)
    else:
        # Handle traditional email/username login
        if not email and not username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Either email, username, or usernameOrEmail is required"
            )

        if email:
            user = crud.get_user_by_email(db, email)
        if username and not user:
            user = crud.get_user_by_username(db, username)

    if not user or user.password != password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect credentials"
        )

    return {
        "message": "Login successful",
        "user_id": user.user_id,
        "username": user.username,
        "role": user.role,
        "sub_role": user.sub_role
    }


@app.post("/logout")
async def logout():
    """
    Handle user logout.
    Returns a success message.
    """
    return {"message": "Logged out successfully"}


@app.post("/chat")
async def chat(
    user_question: str = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    tickets = crud.get_tickets(db, skip=0, limit=10)

    # Convert tickets to a list of dictionaries using your model's actual fields
    ticket_data = [
        {
            "ticket_id": ticket.ticket_id,
            "ticket_title": ticket.ticket_title,
            "description": ticket.description,
            "state": ticket.state,
            "priority": ticket.priority,
            "functional_area": ticket.functional_area,
            "impact": ticket.impact,
            "raised_date": ticket.raised_date.isoformat() if ticket.raised_date else None
        } for ticket in tickets
    ]

    print(ticket_data)

    completion = client.chat.completions.create(
        model="gpt-4-0125-preview",
        messages=[
            {
                "role": "system",
                "content": f"You are a helpful support assistant for our platform. Provide professional and friendly responses without revealing internal system details or implementation strategies. Focus on being helpful while maintaining appropriate confidentiality. Here are the recent tickets: {ticket_data}"
            },
            {
                "role": "user",
                "content": user_question
            }
        ],
        temperature=0.7,
        max_tokens=500
    )

    return {"response": completion.choices[0].message.content}

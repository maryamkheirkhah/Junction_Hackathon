from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import crud, models, schemas
from app.database import engine, get_db
from app.ensure_schema import ensure_schema

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.on_event("startup")
async def startup():
    ensure_schema()

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.post("/tickets/", response_model=schemas.Ticket)
def create_ticket(
    ticket: schemas.TicketCreate,
    user_id: int,
    db: Session = Depends(get_db)
):
    return crud.create_ticket(db=db, ticket=ticket, user_id=user_id)

@app.get("/tickets/user/{user_id}", response_model=List[schemas.Ticket])
def read_user_tickets(
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    tickets = crud.get_user_tickets(db, user_id=user_id, skip=skip, limit=limit)
    return tickets

@app.post("/tickets/{ticket_id}/comments/", response_model=schemas.Comment)
def create_comment(
    ticket_id: int,
    comment: schemas.CommentCreate,
    user_id: int,
    db: Session = Depends(get_db)
):
    return crud.create_ticket_comment(db=db, comment=comment, user_id=user_id)

@app.post("/subscriptions/", response_model=schemas.Subscription)
def create_subscription(
    subscription: schemas.SubscriptionCreate,
    user_id: int,
    db: Session = Depends(get_db)
):
    return crud.create_subscription(db=db, subscription=subscription, user_id=user_id)

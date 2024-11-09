from sqlalchemy.orm import Session
from . import models, schemas
from datetime import datetime

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.user_id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        username=user.username,
        email=user.email,
        password=user.password,
        role=user.role,
        sub_role=user.sub_role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_ticket(db: Session, ticket: schemas.TicketCreate, user_id: int):
    db_ticket = models.Ticket(
        **ticket.dict(),
        created_by=user_id,
        raised_date=datetime.now()
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

def get_user_tickets(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Ticket).filter(
        models.Ticket.created_by == user_id
    ).offset(skip).limit(limit).all()

def create_ticket_comment(db: Session, comment: schemas.CommentCreate, user_id: int):
    db_comment = models.Comment(
        **comment.dict(),
        user_id=user_id
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def create_subscription(db: Session, subscription: schemas.SubscriptionCreate, user_id: int):
    db_subscription = models.Subscription(
        ticket_id=subscription.ticket_id,
        user_id=user_id
    )
    db.add(db_subscription)
    db.commit()
    db.refresh(db_subscription)
    return db_subscription

def create_notification(db: Session, ticket_id: int, user_id: int, notification_text: str):
    db_notification = models.Notification(
        ticket_id=ticket_id,
        user_id=user_id,
        notification_text=notification_text
    )
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification 
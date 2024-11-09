from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    
    user_id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)
    sub_role = Column(String)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    tickets = relationship("Ticket", back_populates="creator")
    comments = relationship("Comment", back_populates="user")
    subscriptions = relationship("Subscription", back_populates="user")
    notifications = relationship("Notification", back_populates="user")

class Ticket(Base):
    __tablename__ = "tickets"
    
    ticket_id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    state = Column(String, nullable=False)
    priority = Column(Integer)
    impact = Column(String)
    raised_date = Column(DateTime, nullable=False)
    completion_date = Column(DateTime)
    requires_action = Column(Boolean)
    created_by = Column(Integer, ForeignKey("users.user_id"))
    
    # Relationships
    creator = relationship("User", back_populates="tickets")
    stages = relationship("Stage", back_populates="ticket")
    comments = relationship("Comment", back_populates="ticket")
    subscriptions = relationship("Subscription", back_populates="ticket")
    notifications = relationship("Notification", back_populates="ticket")

# ... Similar definitions for Stage, Comment, Subscription, and Notification models ... 
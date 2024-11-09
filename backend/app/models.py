from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True)
    username = Column(Text, unique=True, nullable=False)
    email = Column(Text, unique=True, nullable=False)
    password = Column(Text, nullable=False)
    role = Column(Text, nullable=False)
    sub_role = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    tickets = relationship("Ticket", back_populates="creator")
    comments = relationship("Comment", back_populates="user")
    subscriptions = relationship("Subscription", back_populates="user")
    notifications = relationship("Notification", back_populates="user")


class Ticket(Base):
    __tablename__ = "tickets"

    ticket_id = Column(Integer, primary_key=True)
    title = Column(Text, nullable=False)
    description = Column(Text)
    state = Column(Text, nullable=False)
    priority = Column(Integer)
    impact = Column(Text)
    raised_date = Column(DateTime, nullable=False)
    completion_date = Column(DateTime)
    requires_action = Column(Boolean)
    created_by = Column(Integer, ForeignKey("users.user_id"))
    
    # New fields
    planned_release_version = Column(Text)
    resolution_description = Column(Text)
    recommendation = Column(Text)
    next_steps = Column(Text)
    functional_area = Column(Text)
    product_improvement = Column(Boolean)

    # Relationships
    creator = relationship("User", back_populates="tickets")
    stages = relationship("Stage", back_populates="ticket")
    comments = relationship("Comment", back_populates="ticket")
    subscriptions = relationship("Subscription", back_populates="ticket")
    notifications = relationship("Notification", back_populates="ticket")


class Stage(Base):
    __tablename__ = "stages"

    stage_id = Column(Integer, primary_key=True)
    ticket_id = Column(Integer, ForeignKey("tickets.ticket_id"))
    stage_name = Column(Text, nullable=False)
    start_date = Column(DateTime, server_default=func.now())
    end_date = Column(DateTime)
    status = Column(Text)  # New field for stage recommendations

    # Relationships
    ticket = relationship("Ticket", back_populates="stages")


class Comment(Base):
    __tablename__ = "comments"

    comment_id = Column(Integer, primary_key=True)
    ticket_id = Column(Integer, ForeignKey("tickets.ticket_id"))
    user_id = Column(Integer, ForeignKey("users.user_id"))
    comment_text = Column(Text, nullable=False)
    timestamp = Column(DateTime, server_default=func.now())

    # Relationships
    ticket = relationship("Ticket", back_populates="comments")
    user = relationship("User", back_populates="comments")


class Subscription(Base):
    __tablename__ = "subscriptions"

    subscription_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    ticket_id = Column(Integer, ForeignKey("tickets.ticket_id"))
    subscribed_at = Column(DateTime, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="subscriptions")
    ticket = relationship("Ticket", back_populates="subscriptions")


class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(Integer, primary_key=True)
    ticket_id = Column(Integer, ForeignKey("tickets.ticket_id"))
    user_id = Column(Integer, ForeignKey("users.user_id"))
    notification_text = Column(Text, nullable=False)
    is_read = Column(Boolean, server_default='0')
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    ticket = relationship("Ticket", back_populates="notifications")
    user = relationship("User", back_populates="notifications")

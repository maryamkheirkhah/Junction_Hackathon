from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class UserBase(BaseModel):
    username: str
    email: str
    role: str
    sub_role: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class TicketBase(BaseModel):
    title: str
    description: Optional[str] = None
    state: str
    priority: Optional[int] = None
    impact: Optional[str] = None
    requires_action: Optional[bool] = False

class TicketCreate(TicketBase):
    pass

class Ticket(TicketBase):
    ticket_id: int
    created_by: int
    raised_date: datetime
    completion_date: Optional[datetime] = None

    class Config:
        from_attributes = True

class CommentBase(BaseModel):
    comment_text: str

class CommentCreate(CommentBase):
    ticket_id: int

class Comment(CommentBase):
    comment_id: int
    user_id: int
    ticket_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class SubscriptionCreate(BaseModel):
    ticket_id: int

class Subscription(BaseModel):
    subscription_id: int
    user_id: int
    ticket_id: int
    subscribed_at: datetime

    class Config:
        from_attributes = True 
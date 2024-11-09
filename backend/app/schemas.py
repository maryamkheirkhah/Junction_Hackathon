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
    description: str
    clarification: Optional[str] = None
    state: str
    priority: Optional[int] = None
    impact: Optional[str] = None
    requires_action: Optional[bool] = False
    meeting_id: Optional[int] = None
    ticket_title: Optional[str] = None
    planned_release_version: Optional[str] = None
    resolution_description: Optional[str] = None
    recommendation: Optional[str] = None
    next_steps: Optional[str] = None
    functional_area: Optional[str] = None
    product_improvement: Optional[bool] = None


class TicketCreate(TicketBase):
    planned_release_version: Optional[str] = None
    resolution_description: Optional[str] = None
    recommendation: Optional[str] = None
    next_steps: Optional[str] = None
    functional_area: Optional[str] = None
    product_improvement: Optional[bool] = None


class TicketUpdate(BaseModel):
    description: Optional[str] = None
    clarification: Optional[str] = None
    state: Optional[str] = None
    priority: Optional[int] = None
    impact: Optional[str] = None
    requires_action: Optional[bool] = None
    completion_date: Optional[datetime] = None
    meeting_id: Optional[int] = None
    ticket_title: Optional[str] = None
    planned_release_version: Optional[str] = None
    resolution_description: Optional[str] = None
    recommendation: Optional[str] = None
    next_steps: Optional[str] = None
    functional_area: Optional[str] = None
    product_improvement: Optional[bool] = None


class Ticket(TicketBase):
    ticket_id: int
    created_by: Optional[int] = None
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


class StageBase(BaseModel):
    stage_name: str
    status: Optional[str] = None


class StageCreate(StageBase):
    ticket_id: int


class Stage(StageBase):
    stage_id: int
    ticket_id: int
    start_date: datetime
    end_date: Optional[datetime] = None

    class Config:
        from_attributes = True


class NotificationBase(BaseModel):
    notification_text: str


class NotificationCreate(NotificationBase):
    ticket_id: int
    user_id: int


class Notification(NotificationBase):
    notification_id: int
    ticket_id: int
    user_id: int
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

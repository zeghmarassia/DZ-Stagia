from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# Notification Response
class NotificationResponse(BaseModel):
    notification_id: int
    recipient_type: str
    recipient_id: int
    type: str
    title: str
    message: str
    related_entity_type: Optional[str]
    related_entity_id: Optional[int]
    is_read: bool
    created_at: datetime
    read_at: Optional[datetime]
    
    class Config:
        from_attributes = True


# Mark notification as read
class NotificationMarkRead(BaseModel):
    is_read: bool = True


# Notification statistics
class NotificationStatistics(BaseModel):
    total: int
    unread: int
    by_type: dict
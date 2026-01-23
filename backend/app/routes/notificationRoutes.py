from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.notification import (
    NotificationResponse,
    NotificationMarkRead,
    NotificationStatistics
)
from app.services.notificationService import NotificationService
from app.utils.security import get_user  

router = APIRouter(prefix="/notifications", tags=["Notifications"])



@router.get("/", response_model=dict)
def get_notifications(
    unread_only: bool = Query(False, description="Show only unread notifications"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_user),  
    db: Session = Depends(get_db)
):
    """
    Get all notifications for the authenticated user
    
    Accessible by: student, company, admin
    """
    user_type = current_user["user_type"]  # 'student', 'company', 'admin'
    user_id = current_user["user_id"]
    
    notifications, total = NotificationService.get_user_notifications(
        db,
        user_type,
        user_id,
        unread_only,
        page,
        page_size
    )
    
    return {
        "notifications": notifications,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }


@router.get("/unread-count", response_model=dict)
def get_unread_count(
    current_user: dict = Depends(get_user),  
    db: Session = Depends(get_db)
):
    """
    Get count of unread notifications (for badge display)
    
    Returns: {"unread_count": 5}
    """
    user_type = current_user["user_type"]
    user_id = current_user["user_id"]
    
    count = NotificationService.get_unread_count(db, user_type, user_id)
    
    return {"unread_count": count}


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_as_read(
    notification_id: int,
    current_user: dict = Depends(get_user),  
    db: Session = Depends(get_db)
):
    """
    Mark a specific notification as read
    """
    user_type = current_user["user_type"]
    user_id = current_user["user_id"]
    
    notification = NotificationService.mark_as_read(
        db,
        notification_id,
        user_type,
        user_id
    )
    
    return notification


@router.patch("/mark-all-read", status_code=status.HTTP_204_NO_CONTENT)
def mark_all_as_read(
    current_user: dict = Depends(get_user),  
    db: Session = Depends(get_db)
):
    """
    Mark all notifications as read for the current user
    """
    user_type = current_user["user_type"]
    user_id = current_user["user_id"]
    
    NotificationService.mark_all_as_read(db, user_type, user_id)
    
    return None


@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notification(
    notification_id: int,
    current_user: dict = Depends(get_user),  
    db: Session = Depends(get_db)
):
    """
    Delete a specific notification
    """
    user_type = current_user["user_type"]
    user_id = current_user["user_id"]
    
    NotificationService.delete_notification(
        db,
        notification_id,
        user_type,
        user_id
    )
    
    return None


@router.get("/statistics", response_model=NotificationStatistics)
def get_statistics(
    current_user: dict = Depends(get_user),  
    db: Session = Depends(get_db)
):
    """
    Get notification statistics for the current user
    
    Returns:
    - total_notifications
    - unread_notifications
    - read_notifications
    - notifications_by_type
    """
    user_type = current_user["user_type"]
    user_id = current_user["user_id"]
    
    return NotificationService.get_notification_statistics(db, user_type, user_id)
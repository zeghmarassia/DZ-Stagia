"""
app/services/notificationService.py - Adapted for your model
"""
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc
from fastapi import HTTPException, status
from typing import List, Optional
from datetime import datetime

from app.models.notification import Notification


class NotificationService:
    
    @staticmethod
    def create_notification(
        db: Session,
        user_type: str,  # 'student' or 'company'
        user_id: int,
        notification_type: str,
        title: str,
        message: str,
        related_offer_id: Optional[int] = None,
        related_application_id: Optional[int] = None
    ) -> Notification:
        """Create a new notification"""
        
        # Déterminer quel champ remplir
        student_id = user_id if user_type == 'student' else None
        company_id = user_id if user_type == 'company' else None
        
        notification = Notification(
            student_id=student_id,
            company_id=company_id,
            type=notification_type,
            title=title,
            message=message,
            related_offer_id=related_offer_id,
            related_application_id=related_application_id
        )
        
        db.add(notification)
        db.commit()
        db.refresh(notification)
        
        return notification
    
    
    @staticmethod
    def notify_account_approved(
        db: Session,
        user_type: str,
        user_id: int,
        user_email: str
    ):
        """Notify user when account is approved by admin"""
        
        title = "Compte Approuvé"
        message = "Félicitations! Votre compte a été approuvé par l'administration. Vous pouvez maintenant accéder à toutes les fonctionnalités de DZ-Stagiaire."
        
        NotificationService.create_notification(
            db=db,
            user_type=user_type,
            user_id=user_id,
            notification_type='account_approved',
            title=title,
            message=message
        )
    
    
    @staticmethod
    def notify_account_rejected(
        db: Session,
        user_type: str,
        user_id: int,
        user_email: str,
        reason: Optional[str] = None
    ):
        """Notify user when account is rejected by admin"""
        
        title = " Compte Rejeté"
        message = "Votre compte a été rejeté par l'administration."
        
        if reason:
            message += f" Raison: {reason}"
        
        message += " Veuillez contacter le support pour plus d'informations."
        
        NotificationService.create_notification(
            db=db,
            user_type=user_type,
            user_id=user_id,
            notification_type='account_rejected',
            title=title,
            message=message
        )
    
    
    @staticmethod
    def notify_new_application(
        db: Session,
        company_id: int,
        student_name: str,
        offer_title: str,
        offer_id: int,
        application_id: int
    ):
        """Notify company when a student applies to their offer"""
        
        title = " Nouvelle Candidature"
        message = f"{student_name} a postulé à votre offre '{offer_title}'."
        
        NotificationService.create_notification(
            db=db,
            user_type='company',
            user_id=company_id,
            notification_type='new_application',
            title=title,
            message=message,
            related_offer_id=offer_id,
            related_application_id=application_id
        )
    
    
    @staticmethod
    def notify_application_status_changed(
        db: Session,
        student_id: int,
        offer_title: str,
        old_status: str,
        new_status: str,
        company_name: str,
        application_id: int
    ):
        """Notify student when their application status changes"""
        
        status_messages = {
            'in_review': "Votre candidature est en cours d'étude",
            'interview_scheduled': "Un entretien a été planifié",
            'accepted': "Félicitations! Votre candidature a été acceptée",
            'rejected': "Votre candidature a été rejetée"
        }
        
        title = status_messages.get(new_status, "📝 Mise à jour de votre candidature")
        message = f"Le statut de votre candidature pour '{offer_title}' chez {company_name} a changé: {new_status}."
        
        NotificationService.create_notification(
            db=db,
            user_type='student',
            user_id=student_id,
            notification_type='application_status_changed',
            title=title,
            message=message,
            related_application_id=application_id
        )
    
    
    @staticmethod
    def get_user_notifications(
        db: Session,
        user_type: str,
        user_id: int,
        unread_only: bool = False,
        page: int = 1,
        page_size: int = 20
    ) -> tuple[List[Notification], int]:
        """Get all notifications for a user"""
        
        # Construire la requête selon le type d'utilisateur
        if user_type == 'student':
            query = db.query(Notification).filter(Notification.student_id == user_id)
        elif user_type == 'company':
            query = db.query(Notification).filter(Notification.company_id == user_id)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user type"
            )
        
        if unread_only:
            query = query.filter(Notification.is_read == False)
        
        total = query.count()
        
        notifications = query.order_by(desc(Notification.created_at)).offset(
            (page - 1) * page_size
        ).limit(page_size).all()
        
        return notifications, total
    
    
    @staticmethod
    def mark_as_read(
        db: Session,
        notification_id: int,
        user_type: str,
        user_id: int
    ) -> Notification:
        """Mark a notification as read"""
        
        notification = db.query(Notification).filter(
            Notification.notification_id == notification_id
        ).first()
        
        if not notification:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification not found"
            )
        
        # Verify ownership
        if user_type == 'student' and notification.student_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access this notification"
            )
        
        if user_type == 'company' and notification.company_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access this notification"
            )
        
        notification.is_read = True
        notification.read_at = datetime.utcnow()
        
        db.commit()
        db.refresh(notification)
        
        return notification
    
    
    @staticmethod
    def mark_all_as_read(
        db: Session,
        user_type: str,
        user_id: int
    ):
        """Mark all notifications as read for a user"""
        
        if user_type == 'student':
            db.query(Notification).filter(
                Notification.student_id == user_id,
                Notification.is_read == False
            ).update({
                "is_read": True,
                "read_at": datetime.utcnow()
            })
        elif user_type == 'company':
            db.query(Notification).filter(
                Notification.company_id == user_id,
                Notification.is_read == False
            ).update({
                "is_read": True,
                "read_at": datetime.utcnow()
            })
        
        db.commit()
    
    
    @staticmethod
    def delete_notification(
        db: Session,
        notification_id: int,
        user_type: str,
        user_id: int
    ):
        """Delete a notification"""
        
        notification = db.query(Notification).filter(
            Notification.notification_id == notification_id
        ).first()
        
        if not notification:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification not found"
            )
        
        # Verify ownership
        if user_type == 'student' and notification.student_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to delete this notification"
            )
        
        if user_type == 'company' and notification.company_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to delete this notification"
            )
        
        db.delete(notification)
        db.commit()
    
    
    @staticmethod
    def get_unread_count(
        db: Session,
        user_type: str,
        user_id: int
    ) -> int:
        """Get count of unread notifications"""
        
        if user_type == 'student':
            return db.query(Notification).filter(
                Notification.student_id == user_id,
                Notification.is_read == False
            ).count()
        elif user_type == 'company':
            return db.query(Notification).filter(
                Notification.company_id == user_id,
                Notification.is_read == False
            ).count()
        
        return 0
    
    
    @staticmethod
    def get_notification_statistics(
        db: Session,
        user_type: str,
        user_id: int
    ):
        """Get statistics about user's notifications"""
        
        if user_type == 'student':
            notifications = db.query(Notification).filter(
                Notification.student_id == user_id
            ).all()
        elif user_type == 'company':
            notifications = db.query(Notification).filter(
                Notification.company_id == user_id
            ).all()
        else:
            notifications = []
        
        total = len(notifications)
        unread = sum(1 for n in notifications if not n.is_read)
        
        by_type = {}
        for notif in notifications:
            by_type[notif.type] = by_type.get(notif.type, 0) + 1
        
        from app.schemas.notification import NotificationStatistics
        return NotificationStatistics(
            total=total,
            unread=unread,
            by_type=by_type
        )
from app.extensions import db
from app.models.notification import NotificationModel


class NotificationRepository:

    @staticmethod
    def create_notification(notification: NotificationModel):
        db.session.add(notification)
        db.session.commit()
        return notification

    @staticmethod
    def get_user_notifications(user_id: int):
        return NotificationModel.query.filter_by(userId=user_id).order_by(
            NotificationModel.createdAt.desc()
        ).all()

    @staticmethod
    def mark_as_read(notification_id: int, user_id: int):
        notif = NotificationModel.query.filter_by(
            notificationId=notification_id,
            userId=user_id
        ).first()

        if notif:
            notif.isRead = True
            db.session.commit()

        return notif

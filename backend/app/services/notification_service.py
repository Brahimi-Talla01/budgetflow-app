from app.models.notification import NotificationModel
from app.repositories.notification_repo import NotificationRepository


class NotificationService:

    @staticmethod
    def create_notification(title, message, user_id, link=None):
        notif = NotificationModel(
            title=title,
            message=message,
            userId=user_id,
            link=link,
        )
        return NotificationRepository.create_notification(notif)

    @staticmethod
    def get_notifications(user_id):
        return NotificationRepository.get_user_notifications(user_id)

    @staticmethod
    def mark_as_read(notification_id, user_id):
        return NotificationRepository.mark_as_read(notification_id, user_id)

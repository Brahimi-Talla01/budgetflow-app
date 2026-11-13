from app.repositories.notification_repo import NotificationRepository
from app.models.notification import NotificationModel

class NotificationService:

    @staticmethod
    def create_notification(title, message, user_id):
        notif = NotificationModel(
            title=title,
            message=message,
            userId=user_id
        )
        return NotificationRepository.create_notification(notif)

    @staticmethod
    def get_notifications(user_id):
        return NotificationRepository.get_user_notifications(user_id)

    @staticmethod
    def mark_as_read(notification_id, user_id):
        return NotificationRepository.mark_as_read(notification_id, user_id)

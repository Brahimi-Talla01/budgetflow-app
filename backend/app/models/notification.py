from datetime import datetime

from app.extensions import db


class NotificationModel(db.Model):
    __tablename__ = "notification"

    notificationId = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    isRead = db.Column(db.Boolean, default=False, nullable=False)

    # Dates
    createdAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Foreign key
    userId = db.Column(db.Integer, db.ForeignKey('user_account.userId'), nullable=False)

    # Relationship
    user = db.relationship('UserModel', back_populates='notifications')

    def to_dict(self):
        return {
            "notificationId": self.notificationId,
            "title": self.title,
            "message": self.message,
            "isRead": self.isRead,
            "createdAt": self.createdAt.isoformat(),
            "userId": self.userId,
        }

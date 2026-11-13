from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.schemas.notification_schema import NotificationSchema
from app.services.notification_service import NotificationService

notification_bp = Blueprint("notification_bp", __name__)

notif_schema = NotificationSchema()
notif_list_schema = NotificationSchema(many=True)


@notification_bp.get("/")
@jwt_required()
def get_notifications():
    user_id = int(get_jwt_identity())
    notifications = NotificationService.get_notifications(user_id)
    return jsonify(notif_list_schema.dump(notifications)), 200


@notification_bp.patch("/<int:notification_id>")
@jwt_required()
def mark_as_read(notification_id):
    user_id = int(get_jwt_identity())
    notif = NotificationService.mark_as_read(notification_id, user_id)

    if not notif:
        return jsonify({"message": "Notification introuvable"}), 404

    return jsonify({"message": "Notification marquée comme lue"}), 200

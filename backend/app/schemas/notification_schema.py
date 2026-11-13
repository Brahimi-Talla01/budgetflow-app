from marshmallow import Schema, fields

class NotificationSchema(Schema):
    notificationId = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    message = fields.Str(required=True)
    isRead = fields.Bool()
    createdAt = fields.DateTime()
    userId = fields.Int()

from marshmallow import Schema, fields


class ProjectCreateSchema(Schema):
    name = fields.Str(required=True)
    targetAmount = fields.Float(required=True)
    color = fields.Str(required=True)

class ProjectUpdateSchema(Schema):
    name = fields.Str()
    targetAmount = fields.Float()
    color = fields.Str()

class ProjectResponseSchema(Schema):
    projectId = fields.Int()
    name = fields.Str()
    targetAmount = fields.Float()
    color = fields.Str()
    createdAt = fields.Str()
    userId = fields.Int()

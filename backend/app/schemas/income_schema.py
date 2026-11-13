from marshmallow import Schema, fields, validate


class IncomeCreateSchema(Schema):
    amount = fields.Float(required=True)
    source = fields.String(required=True, validate=validate.Length(min=2))
    description = fields.String(allow_none=True)
    date = fields.Date(required=True)
    projectId = fields.Int(allow_none=True)

class IncomeUpdateSchema(Schema):
    amount = fields.Float()
    source = fields.String(validate=validate.Length(min=2))
    description = fields.String(allow_none=True)
    date = fields.Date()
    projectId = fields.Int(allow_none=True)


class IncomeResponseSchema(Schema):
    incomeId = fields.Int()
    amount = fields.Float()
    source = fields.String()
    description = fields.String()
    date = fields.Date()
    isActive = fields.Bool()
    createdAt = fields.DateTime()
    userId = fields.Int()

from marshmallow import Schema, fields, validate


class ExpenseSchema(Schema):
    expenseId = fields.Int(dump_only=True)
    amount = fields.Float(required=True)
    category = fields.Str(required=True, validate=validate.Length(min=2, max=50))
    description = fields.Str(allow_none=True)
    date = fields.Date(required=True)
    isActive = fields.Bool(dump_only=True)
    createdAt = fields.DateTime(dump_only=True)
    userId = fields.Integer(load_only=True)
    projectId = fields.Integer(required=False)

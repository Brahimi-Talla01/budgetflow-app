from marshmallow import Schema, fields, validate

class UserCreateSchema(Schema):
    firstname = fields.String(required=True, validate=validate.Length(min=2, max=20))
    lastname = fields.String(required=True, validate=validate.Length(min=2, max=20))
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=6))
    roleId = fields.Integer(required=True)


class UserLoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True)


class UserResponseSchema(Schema):
    userId = fields.Integer()
    firstname = fields.String()
    lastname = fields.String()
    email = fields.Email()
    isActive = fields.Boolean()
    createdAt = fields.DateTime()
    lastLogin = fields.DateTime()
    role = fields.Nested("RoleResponseSchema", only=("roleId", "name"))

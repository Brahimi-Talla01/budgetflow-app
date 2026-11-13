from marshmallow import Schema, fields, validate

# Créer un rôle
class RoleCreateSchema(Schema):
    name = fields.String(
        required=True,
        validate=validate.Length(min=2, max=50)
    )

# Mettre à jour un rôle
class RoleUpdateSchema(Schema):
    name = fields.String(
        validate=validate.Length(min=2, max=50)
    )

# Renvoyer un rôle
class RoleResponseSchema(Schema):
    roleId = fields.Integer()
    name = fields.String()

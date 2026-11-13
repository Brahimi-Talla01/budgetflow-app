
from app.extensions import db


class RoleModel(db.Model):
    __tablename__ = "role"

    roleId = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)

    # Relationship
    users = db.relationship('UserModel', back_populates='role')

    def to_dict(self):
        return {
            "roleId": self.roleId,
            "name": self.name
        }


from app.extensions import db
from app.models.role import RoleModel


class RoleRepository:

    @staticmethod
    def get_all():
        return RoleModel.query.all()

    @staticmethod
    def get_by_id(role_id):
        return RoleModel.query.get(role_id)

    @staticmethod
    def get_by_name(name):
        return RoleModel.query.filter_by(name=name).first()

    @staticmethod
    def create_role(role):
        db.session.add(role)
        db.session.commit()

    @staticmethod
    def update_role():
        db.session.commit()

    @staticmethod
    def delete_role(role):
        db.session.delete(role)
        db.session.commit()

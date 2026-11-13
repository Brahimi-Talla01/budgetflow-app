from app.extensions import db
from app.models.user import UserModel

class UserRepository:

    @staticmethod
    def get_by_id(user_id):
        return UserModel.query.get(user_id)

    @staticmethod
    def get_by_email(email):
        return UserModel.query.filter_by(email=email).first()

    @staticmethod
    def create_user(user: UserModel):
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def update_user():
        db.session.commit()

    @staticmethod
    def delete_user(user):
        db.session.delete(user)
        db.session.commit()

    @staticmethod
    def list_all():
        return UserModel.query.all()

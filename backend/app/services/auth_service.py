from datetime import datetime, timedelta
from flask_jwt_extended import create_access_token
from app.models.user import UserModel
from app.repositories.user_repo import UserRepository


class AuthService:

    @staticmethod
    def register_user(data):
        # Vérifier l'existence
        existing = UserRepository.get_by_email(data["email"])
        if existing:
            return None, "Un utilisateur avec cet email existe déjà."

        # Créer l'utilisateur
        new_user = UserModel(
            firstname=data["firstname"],
            lastname=data["lastname"],
            email=data["email"],
            roleId=data["roleId"]
        )
        new_user.set_password(data["password"])

        # Sauvegarde via repo
        UserRepository.create_user(new_user)

        return new_user, None

    @staticmethod
    def login_user(email, password):
        user = UserRepository.get_by_email(email)

        if not user:
            return None, None, "Email incorrect."
        if not user.check_password(password):
            return None, None, "Mot de passe incorrect."

        # Mise à jour du lastLogin
        user.lastLogin = datetime.utcnow()
        UserRepository.update_user()

        # Générer token
        access_token = create_access_token(
            identity= str(user.userId),
            expires_delta=timedelta(hours=24)
        )

        return access_token, user, None
    

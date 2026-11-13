from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    unset_jwt_cookies,
)

from app.repositories.user_repo import UserRepository
from app.schemas.user_schema import UserCreateSchema, UserLoginSchema, UserResponseSchema
from app.services.auth_service import AuthService

auth_bp = Blueprint("auth_bp", __name__)

user_create_schema = UserCreateSchema()
user_login_schema = UserLoginSchema()
user_response_schema = UserResponseSchema()


@auth_bp.post("/register")
def register():
    # Valider les données
    data = request.get_json()
    validated_data = user_create_schema.validate(data)

    if validated_data:
        return jsonify({"errors": validated_data}), 400

    # Appeler le service
    user, error = AuthService.register_user(data)
    if error:
        return jsonify({"message": error}), 400

    return jsonify({
        "success": True,
        "message": "Compte créé avec succès.",
        "user": user_response_schema.dump(user)
    }), 201


@auth_bp.post("/login")
def login():
    data = request.get_json()

    # Validation
    errors = user_login_schema.validate(data)
    if errors:
        return jsonify({"errors": errors}), 400

    token, user, error = AuthService.login_user(data["email"], data["password"])

    if error:
        return jsonify({"message": error}), 400

    # Le token voyage uniquement dans un cookie httpOnly, accompagné du cookie
    # CSRF à renvoyer dans l'en-tête X-CSRF-TOKEN pour les requêtes d'écriture.
    response = jsonify({
        "success": True,
        "message": "Connexion réussie.",
        "user": user_response_schema.dump(user)
    })
    set_access_cookies(response, token)

    return response, 200


@auth_bp.get("/me")
@jwt_required()
def me():
    user = UserRepository.get_by_id(int(get_jwt_identity()))

    if not user:
        return jsonify({"message": "Utilisateur introuvable"}), 404

    return jsonify({"user": user_response_schema.dump(user)}), 200


@auth_bp.post("/logout")
def logout():
    response = jsonify({"success": True, "message": "Déconnexion réussie."})
    unset_jwt_cookies(response)
    return response, 200

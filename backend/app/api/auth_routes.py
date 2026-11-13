from flask import Blueprint, request, jsonify
from app.services.auth_service import AuthService
from app.schemas.user_shema import UserCreateSchema, UserLoginSchema, UserResponseSchema

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

    return jsonify({
        "success": True,
        "message": "Connexion réussie.",
        "access_token": str(token),
        "user": user_response_schema.dump(user)
    }), 200


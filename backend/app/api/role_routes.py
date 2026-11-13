from flask import Blueprint, jsonify, request

from app.schemas.role_schema import (
    RoleCreateSchema,
    RoleResponseSchema,
    RoleUpdateSchema,
)
from app.services.role_service import RoleService

role_bp = Blueprint("role_bp", __name__)

create_schema = RoleCreateSchema()
update_schema = RoleUpdateSchema()
response_schema = RoleResponseSchema()
response_many_schema = RoleResponseSchema(many=True)


@role_bp.get("/")
def get_roles():
    roles = RoleService.get_all()
    return jsonify(response_many_schema.dump(roles)), 200


@role_bp.post("/")
def create_role():
    data = request.get_json()
    errors = create_schema.validate(data)

    if errors:
        return jsonify({"errors": errors}), 400

    role, error = RoleService.create_role(data)
    if error:
        return jsonify({"message": error}), 400

    return jsonify({
        "message": "Rôle créé avec succès.",
        "role": response_schema.dump(role)
    }), 201


@role_bp.put("/<int:role_id>")
def update_role(role_id):
    data = request.get_json()
    errors = update_schema.validate(data)

    if errors:
        return jsonify({"errors": errors}), 400

    role, error = RoleService.update_role(role_id, data)
    if error:
        return jsonify({"message": error}), 404

    return jsonify({
        "message": "Rôle mis à jour.",
        "role": response_schema.dump(role)
    }), 200


@role_bp.delete("/<int:role_id>")
def delete_role(role_id):
    _success, error = RoleService.delete_role(role_id)

    if error:
        return jsonify({"message": error}), 404

    return jsonify({"message": "Rôle supprimé avec succès."}), 200

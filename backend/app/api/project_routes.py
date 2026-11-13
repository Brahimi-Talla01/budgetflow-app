from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.schemas.project_schema import (
    ProjectCreateSchema, ProjectUpdateSchema, ProjectResponseSchema
)
from app.services.project_service import ProjectService

project_bp = Blueprint("project_bp", __name__)

create_schema = ProjectCreateSchema()
update_schema = ProjectUpdateSchema()
response_schema = ProjectResponseSchema()
response_list_schema = ProjectResponseSchema(many=True)

# CREATE
@project_bp.post("/")
@jwt_required()
def create_project():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    errors = create_schema.validate(data)
    if errors:
        return jsonify({"errors": errors}), 400

    project = ProjectService.create_project(data, user_id)
    return jsonify(response_schema.dump(project)), 201


# LIST
@project_bp.get("/")
@jwt_required()
def list_projects():
    user_id = int(get_jwt_identity())
    projects = ProjectService.list_projects(user_id)
    return jsonify(response_list_schema.dump(projects)), 200


# GET ONE
@project_bp.get("/<int:project_id>")
@jwt_required()
def get_project(project_id):
    user_id = int(get_jwt_identity())
    project = ProjectService.get_project(project_id, user_id)

    if not project:
        return jsonify({"message": "Projet introuvable"}), 404

    return jsonify(response_schema.dump(project)), 200


# UPDATE
@project_bp.put("/<int:project_id>")
@jwt_required()
def update_project(project_id):
    user_id = int(get_jwt_identity())
    data = request.get_json()

    errors = update_schema.validate(data)
    if errors:
        return jsonify({"errors": errors}), 400

    project, error = ProjectService.update_project(project_id, data, user_id)

    if error:
        return jsonify({"message": error}), 404

    return jsonify(response_schema.dump(project)), 200


# DELETE
@project_bp.delete("/<int:project_id>")
@jwt_required()
def delete_project(project_id):
    user_id = int(get_jwt_identity())
    error = ProjectService.delete_project(project_id, user_id)

    if error:
        return jsonify({"message": error}), 404

    return jsonify({"message": "Projet supprimé"}), 200


# STATS
@project_bp.get("/<int:project_id>/stats")
@jwt_required()
def stats(project_id):
    user_id = int(get_jwt_identity())

    stats, error = ProjectService.get_project_stats(project_id, user_id)
    if error:
        return jsonify({"message": error}), 404

    return jsonify(stats), 200

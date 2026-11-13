from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.schemas.income_shema import (
    IncomeCreateSchema,
    IncomeResponseSchema,
    IncomeUpdateSchema,
)
from app.services.income_service import IncomeService

income_bp = Blueprint("income_bp", __name__)

create_schema = IncomeCreateSchema()
update_schema = IncomeUpdateSchema()
response_schema = IncomeResponseSchema()
response_list_schema = IncomeResponseSchema(many=True)


# CREATE
@income_bp.post("/")
@jwt_required()
def create_income():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    errors = create_schema.validate(data)
    if errors:
        return jsonify({"errors": errors}), 400

    income, error = IncomeService.create_income(data, user_id)

    if error:
        return jsonify({"message": error}), 400

    return jsonify({
        "message": "Revenu créé avec succès",
        "income": response_schema.dump(income)
    }), 201


# GET ALL
@income_bp.get("/")
@jwt_required()
def get_incomes():
    user_id = int(get_jwt_identity())
    incomes = IncomeService.get_all_incomes(user_id)
    return jsonify(response_list_schema.dump(incomes)), 200


# GET BY ID
@income_bp.get("/<int:income_id>")
@jwt_required()
def get_income(income_id):
    user_id = int(get_jwt_identity())

    income = IncomeService.get_income(income_id, user_id)
    if not income:
        return jsonify({"message": "Revenu introuvable"}), 404

    return jsonify(response_schema.dump(income)), 200


# UPDATE
@income_bp.put("/<int:income_id>")
@jwt_required()
def update_income(income_id):
    user_id = int(get_jwt_identity())
    data = request.get_json()

    errors = update_schema.validate(data)
    if errors:
        return jsonify({"errors": errors}), 400

    updated_income, error = IncomeService.update_income(income_id, data, user_id)

    if error:
        return jsonify({"message": error}), 404

    return jsonify({
        "message": "Revenu modifié avec succès",
        "income": response_schema.dump(updated_income)
    }), 200


# DELETE
@income_bp.delete("/<int:income_id>")
@jwt_required()
def delete_income(income_id):
    user_id = int(get_jwt_identity())

    _deleted, error = IncomeService.delete_income(income_id, user_id)

    if error:
        return jsonify({"message": error}), 404

    return jsonify({"message": "Revenu supprimé avec succès"}), 200

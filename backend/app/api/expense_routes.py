from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.services.expense_service import ExpenseService

expense_bp = Blueprint("expense_bp", __name__)


# CREATE
@expense_bp.post("/")
@jwt_required()
def create_expense():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    expense, error = ExpenseService.create_expense(data, user_id)

    if error:
        return jsonify({"errors": error}), 400

    return jsonify({
        "message": "Dépense créée avec succès!",
        "expense": expense.to_dict()
    }), 201



# GET ALL
@expense_bp.get("/")
@jwt_required()
def list_expenses():
    user_id = int(get_jwt_identity())
    expenses = ExpenseService.get_user_expenses(user_id)
    return jsonify(expenses), 200


# GET ONE
@expense_bp.get("/<int:expense_id>")
@jwt_required()
def get_expense(expense_id):
    user_id = int(get_jwt_identity())
    expense = ExpenseService.get_expense(expense_id, user_id)

    if not expense:
        return jsonify({"message": "Dépense introuvable"}), 404

    return jsonify(expense), 200


# UPDATE
@expense_bp.put("/<int:expense_id>")
@jwt_required()
def update_expense(expense_id):
    user_id = int(get_jwt_identity())
    data = request.get_json()

    expense, error = ExpenseService.update_expense(expense_id, data, user_id)

    if error:
        # si non trouvé ou non autorisé
        return jsonify({"message": error}), 404

    return jsonify({
        "message": "Dépense modifiée avec succès!",
        "expense": expense.to_dict()
    }), 200


# DELETE
@expense_bp.delete("/<int:expense_id>")
@jwt_required()
def delete_expense(expense_id):
    user_id = int(get_jwt_identity())

    _expense, error = ExpenseService.delete_expense(expense_id, user_id)

    if error:
        return jsonify({"message": error}), 404

    return jsonify({"message": "Dépense supprimée avec succès!"}), 200

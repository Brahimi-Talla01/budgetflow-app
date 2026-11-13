from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.services.transaction_service import PERIODS, TRANSACTION_TYPES, TransactionService
from app.utils.pagination import parse_pagination

transaction_bp = Blueprint("transaction_bp", __name__)


@transaction_bp.get("/")
@jwt_required()
def list_transactions():
    """Liste paginée des dépenses et revenus, filtres compris.

    Query params : `page`, `perPage`, `type` (`all|expense|income`),
    `search`, `category`, `period`.
    """
    user_id = int(get_jwt_identity())
    page, per_page = parse_pagination(request.args)

    transaction_type = request.args.get("type", "all")
    if transaction_type not in TRANSACTION_TYPES:
        return jsonify({"message": f"Type invalide : {transaction_type}"}), 400

    period = request.args.get("period", "all")
    if period not in PERIODS:
        return jsonify({"message": f"Période invalide : {period}"}), 400

    payload = TransactionService.list_transactions(
        user_id,
        page=page,
        per_page=per_page,
        transaction_type=transaction_type,
        search=request.args.get("search", ""),
        category=request.args.get("category", "all"),
        period=period,
    )

    return jsonify(payload), 200

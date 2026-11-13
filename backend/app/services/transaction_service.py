from datetime import date

from app.repositories.expense_repo import ExpenseRepository
from app.repositories.income_repo import IncomeRepository
from app.utils.pagination import build_pagination

TRANSACTION_TYPES = ("all", "expense", "income")
PERIODS = ("all", "last_7_days", "this_month", "last_6_months", "this_year")


def _month_distance(day, today):
    return (today.year - day.year) * 12 + (today.month - day.month)


def _in_period(day, period, today):
    if period == "last_7_days":
        return 0 <= (today - day).days <= 7

    if period == "this_month":
        return day.year == today.year and day.month == today.month

    if period == "last_6_months":
        return 0 <= _month_distance(day, today) <= 6

    if period == "this_year":
        return day.year == today.year

    return True


class TransactionService:
    """Vue fusionnée des dépenses et des revenus, paginée côté serveur."""

    @staticmethod
    def list_transactions(
        user_id,
        page=1,
        per_page=5,
        transaction_type="all",
        search="",
        category="all",
        period="all",
        today=None,
    ):
        today = today or date.today()
        rows = TransactionService._collect_rows(user_id)

        categories = sorted({row["category"] for row in rows}, key=str.lower)

        filtered = [
            row
            for row in rows
            if (transaction_type == "all" or row["type"] == transaction_type)
            and (category == "all" or row["category"] == category)
            and _in_period(date.fromisoformat(row["date"]), period, today)
            and TransactionService._matches_search(row, search)
        ]

        summary = {"incomes": 0.0, "expenses": 0.0}
        for row in filtered:
            key = "incomes" if row["type"] == "income" else "expenses"
            summary[key] += row["amount"]

        current_page, start, end, pagination = build_pagination(
            page, per_page, len(filtered)
        )

        return {
            "items": filtered[start:end],
            "pagination": pagination,
            "summary": {
                "incomes": round(summary["incomes"], 2),
                "expenses": round(summary["expenses"], 2),
                "balance": round(summary["incomes"] - summary["expenses"], 2),
            },
            "categories": categories,
        }

    @staticmethod
    def _collect_rows(user_id):
        rows = []

        for expense in ExpenseRepository.get_user_expenses(user_id):
            rows.append(
                {
                    "id": expense.expenseId,
                    "type": "expense",
                    "label": expense.description or expense.category,
                    "category": expense.category,
                    "amount": float(expense.amount),
                    "date": expense.date.isoformat(),
                    "description": expense.description,
                    "projectId": expense.projectId,
                }
            )

        for income in IncomeRepository.get_user_incomes(user_id):
            rows.append(
                {
                    "id": income.incomeId,
                    "type": "income",
                    "label": income.description or income.source,
                    "category": income.source,
                    "amount": float(income.amount),
                    "date": income.date.isoformat(),
                    "description": income.description,
                    "projectId": income.projectId,
                }
            )

        rows.sort(key=lambda row: (row["date"], row["id"]), reverse=True)
        return rows

    @staticmethod
    def _matches_search(row, search):
        query = (search or "").strip().lower()
        if not query:
            return True

        haystack = " ".join(
            [
                row["label"] or "",
                row["category"] or "",
                row["description"] or "",
            ]
        ).lower()

        return query in haystack

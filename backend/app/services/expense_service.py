from app.models.expense import ExpenseModel
from app.notifications.notification_manager import NotificationManager
from app.repositories.expense_repo import ExpenseRepository
from app.repositories.project_repo import ProjectRepository
from app.schemas.expense_schema import ExpenseSchema
from app.utils.dates import parse_date

expense_schema = ExpenseSchema()
expense_list_schema = ExpenseSchema(many=True)

class ExpenseService:

    @staticmethod
    def create_expense(data, user_id):

        # Vérification projet
        project_id = data.get("projectId")

        if project_id:
            project = ProjectRepository.get_user_project(project_id, user_id)

            if not project:
                return None, "Projet introuvable ou non autorisé"

        # Validation JSON
        errors = expense_schema.validate(data)
        if errors:
            return None, errors

        # Création expense
        expense = ExpenseModel(
            amount=data["amount"],
            category=data["category"],
            description=data.get("description"),
            date=parse_date(data["date"]),
            userId=user_id,
            projectId=data.get("projectId")
        )

        saved_expense = ExpenseRepository.create_expense(expense)

        NotificationManager.on_expense_created(expense)

        return saved_expense, None

    @staticmethod
    def get_user_expenses(user_id):
        expenses = ExpenseRepository.get_user_expenses(user_id)
        return expense_list_schema.dump(expenses)

    @staticmethod
    def get_expense(expense_id, user_id):
        expense = ExpenseRepository.get_expense_by_id(expense_id)

        # Ne pas révéler l'existence d'une dépense appartenant à un autre compte.
        if not expense or expense.userId != user_id:
            return None

        return expense_schema.dump(expense)

    @staticmethod
    def update_expense(expense_id, data, user_id):
        expense = ExpenseRepository.get_expense_by_id(expense_id)
        if not expense:
            return None, "Expense not found"

        # Empêcher modification si cela n'appartient pas au user
        if expense.userId != user_id:
            return None, "Non autorisé"

        # Mise à jour
        for field in ["amount", "category", "description", "projectId"]:
            if field in data:
                setattr(expense, field, data[field])

        if "date" in data:
            expense.date = parse_date(data["date"])

        ExpenseRepository.update_expense(expense)
        return expense, None

    @staticmethod
    def delete_expense(expense_id, user_id):
        expense = ExpenseRepository.get_expense_by_id(expense_id)
        if not expense:
            return None, "Expense not found"

        if expense.userId != user_id:
            return None, "Non autorisé"

        ExpenseRepository.soft_delete(expense)
        return expense, None

from app.notifications.notification_manager import NotificationManager
from app.repositories.income_repo import IncomeRepository
from app.repositories.project_repo import ProjectRepository
from app.utils.dates import parse_date


class IncomeService:

    @staticmethod
    def create_income(data, user_id):

        project_id = data.get("projectId")

        # Vérifier que le projet appartient à l'utilisateur
        if project_id:
            project = ProjectRepository.get_user_project(project_id, user_id)

            if not project:
                return None, "Projet introuvable ou non autorisé"

        payload = {**data, "date": parse_date(data["date"])}
        income = IncomeRepository.create_income(payload, user_id)

        NotificationManager.on_income_created(income)

        return income, None

    @staticmethod
    def get_all_incomes(user_id):
        return IncomeRepository.get_user_incomes(user_id)

    @staticmethod
    def get_income(income_id, user_id):
        return IncomeRepository.get_income_by_id(income_id, user_id)

    @staticmethod
    def update_income(income_id, data, user_id):
        income = IncomeRepository.get_income_by_id(income_id, user_id)
        if not income:
            return None

        payload = {**data}
        if "date" in payload:
            payload["date"] = parse_date(payload["date"])

        return IncomeRepository.update_income(income, payload)

    @staticmethod
    def delete_income(income_id, user_id):
        income = IncomeRepository.get_income_by_id(income_id, user_id)
        if not income:
            return None
        return IncomeRepository.soft_delete_income(income)

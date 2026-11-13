from app.repositories.income_repo import IncomeRepository
from app.repositories.project_repo import ProjectRepository
from app.notifications.notification_manager import NotificationManager


class IncomeService:

    @staticmethod
    def create_income(data, user_id):

        project_id = data.get("projectId")

        # Vérifier que le projet appartient à l'utilisateur
        if project_id:
            project = ProjectRepository.get_user_project(project_id, user_id)

            if not project:
                return None, "Projet introuvable ou non autorisé"

        income = IncomeRepository.create_income(data, user_id)

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
        return IncomeRepository.update_income(income, data)

    @staticmethod
    def delete_income(income_id, user_id):
        income = IncomeRepository.get_income_by_id(income_id, user_id)
        if not income:
            return None
        return IncomeRepository.soft_delete_income(income)

from app.repositories.project_repo import ProjectRepository
from app.services.notification_service import NotificationService


class NotificationManager:

    @staticmethod
    def on_expense_created(expense):
        NotificationService.create_notification(
            title="Nouvelle dépense",
            message=f"Vous avez ajouté une dépense de {expense.amount} FCFA.",
            user_id=expense.userId,
            link=f"/dashboard/transaction/expense/{expense.expenseId}",
        )

        # Si associée à un projet → then check progression
        if expense.projectId:
            NotificationManager.check_project_progress(expense.projectId, expense.userId)

    @staticmethod
    def on_income_created(income):
        NotificationService.create_notification(
            title="Nouveau revenu",
            message=f"Vous avez enregistré un revenu de {income.amount} FCFA.",
            user_id=income.userId,
            link=f"/dashboard/transaction/income/{income.incomeId}",
        )

        if income.projectId:
            NotificationManager.check_project_progress(income.projectId, income.userId)

    @staticmethod
    def check_project_progress(project_id, user_id):
        project = ProjectRepository.get_user_project(project_id, user_id)
        if not project:
            return

        total_incomes = sum(i.amount for i in project.incomes if i.isActive)
        total_expenses = sum(e.amount for e in project.expenses if e.isActive)

        progress = total_incomes - total_expenses

        percentage = (progress / project.targetAmount) * 100

        if percentage >= 100:
            NotificationService.create_notification(
                title="Projet réussi",
                message=f"Votre projet '{project.name}' a atteint son objectif !",
                user_id=user_id,
                link=f"/dashboard/projet/{project.projectId}",
            )
        elif percentage >= 50:
            NotificationService.create_notification(
                title="Projet à moitié atteint",
                message=f"Vous avez atteint 50% de votre objectif pour '{project.name}'.",
                user_id=user_id,
                link=f"/dashboard/projet/{project.projectId}",
            )

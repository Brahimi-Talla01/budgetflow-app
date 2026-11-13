from app.repositories.project_repo import ProjectRepository


class ProjectService:

    @staticmethod
    def create_project(data, user_id):
        return ProjectRepository.create_project(data, user_id)

    @staticmethod
    def list_projects(user_id):
        return ProjectRepository.get_user_projects(user_id)

    @staticmethod
    def get_project(project_id, user_id):
        return ProjectRepository.get_user_project(project_id, user_id)

    @staticmethod
    def update_project(project_id, data, user_id):
        project = ProjectRepository.get_user_project(project_id, user_id)
        if not project:
            return None, "Projet introuvable"

        updated = ProjectRepository.update_project(project, data)
        return updated, None

    @staticmethod
    def delete_project(project_id, user_id):
        project = ProjectRepository.get_user_project(project_id, user_id)
        if not project:
            return "Projet introuvable"

        ProjectRepository.delete_project(project)
        return None

    # STATS
    @staticmethod
    def get_project_stats(project_id, user_id):
        project = ProjectRepository.get_user_project(project_id, user_id)
        if not project:
            return None, "Projet introuvable"

        total_expenses = float(ProjectRepository.get_project_expenses_total(project_id, user_id))
        total_incomes = float(ProjectRepository.get_project_incomes_total(project_id, user_id))

        net_progress = total_incomes - total_expenses
        percent = min(max((net_progress / float(project.targetAmount)) * 100, 0), 100)

        return {
            "projectId": project_id,
            "targetAmount": float(project.targetAmount),
            "totalExpenses": total_expenses,
            "totalIncomes": total_incomes,
            "progress": net_progress,
            "percent": percent
        }, None

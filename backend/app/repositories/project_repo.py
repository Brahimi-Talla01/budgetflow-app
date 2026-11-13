from app.models.project import ProjectModel
from app.models.expense import ExpenseModel
from app.models.income import IncomeModel
from app.extensions import db
from sqlalchemy import func

class ProjectRepository:

    @staticmethod
    def create_project(data, user_id):
        project = ProjectModel(
            name=data["name"],
            targetAmount=data["targetAmount"],
            color=data["color"],
            userId=user_id
        )
        db.session.add(project)
        db.session.commit()
        return project

    @staticmethod
    def get_user_projects(user_id):
        return ProjectModel.query.filter_by(userId=user_id).all()

    @staticmethod
    def get_user_project(project_id, user_id):
        return ProjectModel.query.filter_by(projectId=project_id, userId=user_id).first()

    @staticmethod
    def update_project(project, data):
        for key, value in data.items():
            setattr(project, key, value)
        db.session.commit()
        return project

    @staticmethod
    def delete_project(project):
        db.session.delete(project)
        db.session.commit()

    # STATISTIQUES
    @staticmethod
    def get_project_expenses_total(project_id, user_id):
        return db.session.query(func.coalesce(func.sum(ExpenseModel.amount), 0)) \
            .filter_by(projectId=project_id, userId=user_id).scalar()

    @staticmethod
    def get_project_incomes_total(project_id, user_id):
        return db.session.query(func.coalesce(func.sum(IncomeModel.amount), 0)) \
            .filter_by(projectId=project_id, userId=user_id).scalar()

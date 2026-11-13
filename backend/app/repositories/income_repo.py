from app.extensions import db
from app.models.income import IncomeModel


class IncomeRepository:

    @staticmethod
    def create_income(data, user_id):
        income = IncomeModel(
            amount=data["amount"],
            source=data["source"],
            description=data.get("description"),
            date=data["date"],
            userId=user_id,
            projectId=data.get("projectId")
        )
        db.session.add(income)
        db.session.commit()
        return income

    @staticmethod
    def get_user_incomes(user_id):
        return IncomeModel.query.filter_by(userId=user_id, isActive=True).all()

    @staticmethod
    def get_income_by_id(income_id, user_id):
        return IncomeModel.query.filter_by(incomeId=income_id, userId=user_id, isActive=True).first()

    @staticmethod
    def update_income(income, data):
        for key, value in data.items():
            setattr(income, key, value)
        db.session.commit()
        return income

    @staticmethod
    def soft_delete_income(income):
        income.isActive = False
        db.session.commit()
        return income

from app.extensions import db
from app.models.expense import ExpenseModel


class ExpenseRepository:

    @staticmethod
    def create_expense(expense: ExpenseModel):
        db.session.add(expense)
        db.session.commit()
        return expense


    @staticmethod
    def get_user_expenses(user_id: int):
        return ExpenseModel.query.filter_by(
            userId=user_id,
            isActive=True
        ).order_by(ExpenseModel.date.desc()).all()

    @staticmethod
    def get_expense_by_id(expense_id: int):
        return ExpenseModel.query.filter_by(
            expenseId=expense_id,
            isActive=True
        ).first()

    @staticmethod
    def update_expense(expense: ExpenseModel):
        db.session.commit()
        return expense

    @staticmethod
    def soft_delete(expense: ExpenseModel):
        expense.isActive = False
        db.session.commit()
        return expense

from app.extensions import db
from datetime import datetime

class ExpenseModel(db.Model):
    __tablename__ = "expense"

    expenseId = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255))
    date = db.Column(db.Date, nullable=False)
    isActive = db.Column(db.Boolean, default=True, nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)



    # Foreign key
    projectId = db.Column(db.Integer, db.ForeignKey('project.projectId'), nullable=True)
    userId = db.Column(db.Integer, db.ForeignKey('user_account.userId'), nullable=False)

    # Relationship
    user = db.relationship('UserModel', back_populates='expenses')
    project = db.relationship("ProjectModel", back_populates="expenses")

    def to_dict(self):
        return {
            'expenseId': self.expenseId,
            'amount': float(self.amount),
            'category': self.category,
            'description': self.description,
            'date': self.date.isoformat() if self.date else None,
            'isActive': self.isActive,
            'createdAt': self.createdAt.isoformat() if self.createdAt else None,
            'userId': self.userId,
            'projectId': self.projectId,
        }

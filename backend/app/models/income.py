from datetime import datetime

from app.extensions import db


class IncomeModel(db.Model):
    __tablename__ = "income"

    incomeId = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    source = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255))
    date = db.Column(db.Date, nullable=False)
    isActive = db.Column(db.Boolean, default=True, nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)


    # Foreign key
    userId = db.Column(db.Integer, db.ForeignKey('user_account.userId'), nullable=False)
    projectId = db.Column(db.Integer, db.ForeignKey('project.projectId'), nullable=True)

    # Relationship
    user = db.relationship('UserModel', back_populates='incomes')
    project = db.relationship("ProjectModel", back_populates="incomes")

    def to_dict(self):
        return {
            'incomeId': self.incomeId,
            'amount': float(self.amount),
            'source': self.source,
            'description': self.description,
            'date': self.date.isoformat() if self.date else None,
            'isActive': self.isActive,
            'createdAt': self.createdAt.isoformat() if self.createdAt else None,
            'userId': self.userId,
            'projectId': self.projectId,
        }

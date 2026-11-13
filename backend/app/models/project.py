from datetime import datetime

from app.extensions import db


class ProjectModel(db.Model):
    __tablename__ = "project"

    projectId = db.Column(db.Integer, primary_key=True)
    targetAmount = db.Column(db.Numeric(10, 2), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    color = db.Column(db.String(10), nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Foreign key
    userId = db.Column(db.Integer, db.ForeignKey('user_account.userId'), nullable=False)

    # Relationships
    user = db.relationship('UserModel', back_populates='projects')

    incomes = db.relationship("IncomeModel", back_populates="project", lazy="dynamic")
    expenses = db.relationship("ExpenseModel", back_populates="project", lazy="dynamic")

    def to_dict(self):
        return {
            'projectId': self.projectId,
            'targetAmount': float(self.targetAmount),
            'name': self.name,
            'color': self.color,
            'createdAt': self.createdAt.isoformat() if self.createdAt else None,
            'userId': self.userId,
        }

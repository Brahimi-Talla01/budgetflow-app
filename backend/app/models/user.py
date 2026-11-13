from app.extensions import db, bcrypt
from datetime import datetime

class UserModel(db.Model):
    __tablename__ = "user_account"

    userId = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(20))
    lastname = db.Column(db.String(20))
    email = db.Column(db.String(150), unique=True, nullable=False)
    passwordHash = db.Column(db.String(255), nullable=False)
    isActive = db.Column(db.Boolean, default=True, nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    lastLogin = db.Column(db.DateTime)

    # Foreign key
    roleId = db.Column(db.Integer, db.ForeignKey('role.roleId'), nullable=False)

    # Relations
    role = db.relationship('RoleModel', back_populates='users')

    notifications = db.relationship(
        'NotificationModel',
        back_populates='user',
        cascade="all, delete"
    )

    expenses = db.relationship(
        'ExpenseModel',
        back_populates='user',
        cascade="all, delete"
    )

    incomes = db.relationship(
        'IncomeModel',
        back_populates='user',
        cascade="all, delete"
    )

    projects = db.relationship(
        'ProjectModel',
        back_populates='user',
        cascade="all, delete"
    )

    def set_password(self, password):
        """Hashage du mot de passe"""
        self.passwordHash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        """Vérification du mot de passe"""
        return bcrypt.check_password_hash(self.passwordHash, password)

    def to_dict(self):
        return {
            'userId': self.userId,
            'firstname': self.firstname,
            'lastname': self.lastname,
            'email': self.email,
            'isActive': self.isActive,
            'createdAt': self.createdAt.isoformat() if self.createdAt else None,
            'lastLogin': self.lastLogin.isoformat() if self.lastLogin else None,
            'role': self.role.to_dict() if self.role else None,
        }

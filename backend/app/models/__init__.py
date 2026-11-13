"""
Importation centralisée de tous les modèles.
L'ordre est CRITIQUE pour respecter les dépendances des clés étrangères.
"""

from app.models.expense import ExpenseModel
from app.models.income import IncomeModel
from app.models.notification import NotificationModel
from app.models.project import ProjectModel
from app.models.role import RoleModel
from app.models.user import UserModel

__all__ = [
      "ExpenseModel",
      "IncomeModel",
      "NotificationModel",
      "ProjectModel",
      "RoleModel",
      "UserModel",
]

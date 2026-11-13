"""
Importation centralisée de tous les modèles.
L'ordre est CRITIQUE pour respecter les dépendances des clés étrangères.
"""

from app.models.user import UserModel
from app.models.role import RoleModel
from app.models.expense import ExpenseModel
from app.models.income import IncomeModel
from app.models.project import ProjectModel
from app.models.notification import NotificationModel

__all__ = [
      "UserModel",
      "RoleModel",
      "ExpenseModel",
      "IncomeModel",
      "ProjectModel",
      "NotificationModel",
]
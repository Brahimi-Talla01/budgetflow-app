from flask import Flask

#Importation des routes
from app.api.auth_routes import auth_bp
from app.api.expense_routes import expense_bp
from app.api.income_routes import income_bp
from app.api.notification_routes import notification_bp
from app.api.project_routes import project_bp
from app.api.role_routes import role_bp
from app.congig import Config
from app.extensions import bcrypt, cors, db, jwt, migrate
from app.models import (
      ExpenseModel as ExpenseModel,
)
from app.models import (
      IncomeModel as IncomeModel,
)
from app.models import (
      NotificationModel as NotificationModel,
)
from app.models import (
      ProjectModel as ProjectModel,
)
from app.models import (
      RoleModel as RoleModel,
)
from app.models import (
      UserModel as UserModel,
)

# Préfix global pour mes REST API
api_prefix = "/api/v1"

def create_app():
      app = Flask(__name__)

      #Chargement des configurations
      app.config.from_object(Config)

      #Initialisation des extensions
      db.init_app(app)
      jwt.init_app(app)
      migrate.init_app(app, db)
      bcrypt.init_app(app)
      cors.init_app(app)


      #Enregistrer les routes (Blueprints)
      app.register_blueprint(auth_bp, url_prefix=f"{api_prefix}/auth")
      app.register_blueprint(role_bp, url_prefix=f"{api_prefix}/roles")
      app.register_blueprint(expense_bp, url_prefix=f"{api_prefix}/expenses")
      app.register_blueprint(income_bp, url_prefix=f"{api_prefix}/incomes")
      app.register_blueprint(project_bp, url_prefix=f"{api_prefix}/projects")
      app.register_blueprint(notification_bp, url_prefix=f"{api_prefix}/notifications")


      @app.route('/health')
      def health():
            return {"message": "Backend Running"}, 200

      return app

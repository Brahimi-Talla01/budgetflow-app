from flask import Flask, jsonify
from flask_jwt_extended.exceptions import CSRFError
from werkzeug.exceptions import HTTPException

#Importation des routes
from app.api.auth_routes import auth_bp
from app.api.expense_routes import expense_bp
from app.api.income_routes import income_bp
from app.api.notification_routes import notification_bp
from app.api.project_routes import project_bp
from app.api.role_routes import role_bp
from app.api.transaction_routes import transaction_bp
from app.config import Config
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

      # CORS restreint : seules les origines déclarées peuvent appeler l'API,
      # avec cookies (session httpOnly).
      cors.init_app(
            app,
            resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
            supports_credentials=True,
      )


      #Enregistrer les routes (Blueprints)
      app.register_blueprint(auth_bp, url_prefix=f"{api_prefix}/auth")
      app.register_blueprint(role_bp, url_prefix=f"{api_prefix}/roles")
      app.register_blueprint(expense_bp, url_prefix=f"{api_prefix}/expenses")
      app.register_blueprint(income_bp, url_prefix=f"{api_prefix}/incomes")
      app.register_blueprint(transaction_bp, url_prefix=f"{api_prefix}/transactions")
      app.register_blueprint(project_bp, url_prefix=f"{api_prefix}/projects")
      app.register_blueprint(notification_bp, url_prefix=f"{api_prefix}/notifications")

      @app.route('/health')
      def health():
            return {"message": "Backend Running"}, 200

      # Erreurs JWT : même format de réponse que le reste de l'API.
      @jwt.unauthorized_loader
      def handle_missing_token(reason):
            return jsonify({
                  "success": False,
                  "message": "Authentification requise.",
            }), 401

      @jwt.invalid_token_loader
      def handle_invalid_token(reason):
            return jsonify({
                  "success": False,
                  "message": "Jeton d'authentification invalide.",
            }), 401

      @jwt.expired_token_loader
      def handle_expired_token(jwt_header, jwt_payload):
            return jsonify({
                  "success": False,
                  "message": "Votre session a expiré, veuillez vous reconnecter.",
            }), 401

      @jwt.revoked_token_loader
      def handle_revoked_token(jwt_header, jwt_payload):
            return jsonify({
                  "success": False,
                  "message": "Session révoquée, veuillez vous reconnecter.",
            }), 401

      @app.errorhandler(CSRFError)
      def handle_csrf_error(error):
            return jsonify({
                  "success": False,
                  "message": "Jeton CSRF manquant ou invalide.",
            }), 401

      @app.errorhandler(HTTPException)
      def handle_http_error(error):
            return jsonify({
                  "success": False,
                  "message": error.description,
            }), error.code

      @app.errorhandler(Exception)
      def handle_unexpected_error(error):
            app.logger.exception("Erreur inattendue", exc_info=error)
            return jsonify({
                  "success": False,
                  "message": "Une erreur interne est survenue.",
            }), 500

      return app

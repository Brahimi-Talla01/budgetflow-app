import os
from datetime import timedelta

from dotenv import load_dotenv

# Chargement automatique des variables d'environnements
load_dotenv()

DEFAULT_DEV_JWT_SECRET = "default-dev-key"
DEFAULT_CORS_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173"


def _jwt_secret():
    secret = os.getenv("JWT_SECRET_KEY")

    if secret:
        return secret

    if os.getenv("APP_ENV", "development").lower() in {"production", "prod"}:
        raise RuntimeError(
            "JWT_SECRET_KEY doit être défini lorsque APP_ENV=production."
        )

    return DEFAULT_DEV_JWT_SECRET


def _cors_origins():
    raw_origins = os.getenv("CORS_ORIGINS", DEFAULT_CORS_ORIGINS)
    return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]


def _as_bool(value):
    return str(value).lower() in {"1", "true", "yes", "on"}


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Authentification par cookie httpOnly : le token n'est jamais exposé au JavaScript.
    JWT_SECRET_KEY = _jwt_secret()
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_ACCESS_COOKIE_PATH = "/api/v1"
    JWT_COOKIE_CSRF_PROTECT = True
    JWT_COOKIE_SECURE = _as_bool(os.getenv("JWT_COOKIE_SECURE", "false"))
    JWT_COOKIE_SAMESITE = os.getenv("JWT_COOKIE_SAMESITE", "Lax")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

    CORS_ORIGINS = _cors_origins()

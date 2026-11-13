import os
import tempfile
from pathlib import Path

# La configuration lit l'environnement à l'import : elle doit être posée avant
# d'importer l'application.
_TMP_DIR = Path(tempfile.mkdtemp(prefix="budgetflow-tests-"))
os.environ["DATABASE_URL"] = f"sqlite:///{_TMP_DIR / 'test.db'}"
os.environ["JWT_SECRET_KEY"] = "test-secret-key"

import pytest  # noqa: E402

from app import create_app  # noqa: E402
from app.extensions import db  # noqa: E402
from app.models import RoleModel  # noqa: E402

USER_EMAIL = "user@budgetflow.test"
USER_PASSWORD = "motdepasse123"


@pytest.fixture()
def app():
    application = create_app()
    application.config.update(TESTING=True)

    with application.app_context():
        db.drop_all()
        db.create_all()
        db.session.add_all([RoleModel(name="admin"), RoleModel(name="user")])
        db.session.commit()

        yield application

        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def user_role_id(app):
    with app.app_context():
        return RoleModel.query.filter_by(name="user").first().roleId


@pytest.fixture()
def register_payload(user_role_id):
    return {
        "firstname": "Awa",
        "lastname": "Test",
        "email": USER_EMAIL,
        "password": USER_PASSWORD,
        "roleId": user_role_id,
    }


@pytest.fixture()
def auth_headers(client, register_payload):
    """Connecte le client (cookie httpOnly) et renvoie l'en-tête CSRF."""
    client.post("/api/v1/auth/register", json=register_payload)
    client.post(
        "/api/v1/auth/login",
        json={"email": USER_EMAIL, "password": USER_PASSWORD},
    )
    csrf_cookie = client.get_cookie("csrf_access_token")
    assert csrf_cookie is not None, "le cookie CSRF doit être émis à la connexion"

    return {"X-CSRF-TOKEN": csrf_cookie.value}

from tests.conftest import USER_EMAIL, USER_PASSWORD


def test_register_creates_user(client, register_payload):
    response = client.post("/api/v1/auth/register", json=register_payload)

    assert response.status_code == 201
    body = response.get_json()
    assert body["success"] is True
    assert body["user"]["email"] == USER_EMAIL
    assert "password" not in body["user"]
    assert "passwordHash" not in body["user"]


def test_register_rejects_duplicate_email(client, register_payload):
    client.post("/api/v1/auth/register", json=register_payload)

    response = client.post("/api/v1/auth/register", json=register_payload)

    assert response.status_code == 400
    assert "existe déjà" in response.get_json()["message"]


def test_register_rejects_invalid_payload(client, register_payload):
    payload = {**register_payload, "email": "pas-un-email"}

    response = client.post("/api/v1/auth/register", json=payload)

    assert response.status_code == 400
    assert "email" in response.get_json()["errors"]


def test_login_returns_token_and_user(client, register_payload):
    client.post("/api/v1/auth/register", json=register_payload)

    response = client.post(
        "/api/v1/auth/login",
        json={"email": USER_EMAIL, "password": USER_PASSWORD},
    )

    assert response.status_code == 200
    body = response.get_json()
    assert body["access_token"]
    assert body["user"]["email"] == USER_EMAIL


def test_login_rejects_wrong_password(client, register_payload):
    client.post("/api/v1/auth/register", json=register_payload)

    response = client.post(
        "/api/v1/auth/login",
        json={"email": USER_EMAIL, "password": "mauvais-mot-de-passe"},
    )

    assert response.status_code == 400
    assert "Mot de passe incorrect" in response.get_json()["message"]


def test_protected_route_requires_token(client):
    response = client.get("/api/v1/expenses/")

    assert response.status_code == 401

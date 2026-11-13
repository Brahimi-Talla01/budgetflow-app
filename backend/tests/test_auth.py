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


def test_login_sets_http_only_cookie(client, register_payload):
    client.post("/api/v1/auth/register", json=register_payload)

    response = client.post(
        "/api/v1/auth/login",
        json={"email": USER_EMAIL, "password": USER_PASSWORD},
    )

    assert response.status_code == 200
    body = response.get_json()
    assert body["user"]["email"] == USER_EMAIL
    # Le token ne doit jamais être renvoyé dans le corps JSON.
    assert "access_token" not in body

    access_cookie = client.get_cookie("access_token_cookie", path="/api/v1")
    assert access_cookie is not None
    assert access_cookie.http_only is True

    csrf_cookie = client.get_cookie("csrf_access_token")
    assert csrf_cookie is not None
    assert not csrf_cookie.http_only


def test_me_returns_authenticated_user(client, auth_headers):
    response = client.get("/api/v1/auth/me")

    assert response.status_code == 200
    assert response.get_json()["user"]["email"] == USER_EMAIL


def test_logout_clears_session(client, auth_headers):
    response = client.post("/api/v1/auth/logout", headers=auth_headers)

    assert response.status_code == 200
    assert client.get("/api/v1/auth/me").status_code == 401


def test_write_requires_csrf_header(client, register_payload):
    client.post("/api/v1/auth/register", json=register_payload)
    client.post(
        "/api/v1/auth/login",
        json={"email": USER_EMAIL, "password": USER_PASSWORD},
    )

    response = client.post(
        "/api/v1/expenses/",
        json={"amount": 10, "category": "Transport", "date": "2026-01-01"},
    )

    assert response.status_code == 401
    body = response.get_json()
    assert body["success"] is False
    assert "CSRF" in body["message"]


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

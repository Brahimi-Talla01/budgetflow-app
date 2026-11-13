EXPENSE_PAYLOAD = {
    "amount": 1500.5,
    "category": "Alimentation",
    "description": "Courses de la semaine",
    "date": "2026-01-15",
}


def test_create_expense(client, auth_headers):
    response = client.post("/api/v1/expenses/", json=EXPENSE_PAYLOAD, headers=auth_headers)

    assert response.status_code == 201
    expense = response.get_json()["expense"]
    assert expense["amount"] == 1500.5
    assert expense["category"] == "Alimentation"
    assert expense["userId"] is not None


def test_list_expenses_returns_created_items(client, auth_headers):
    client.post("/api/v1/expenses/", json=EXPENSE_PAYLOAD, headers=auth_headers)

    response = client.get("/api/v1/expenses/", headers=auth_headers)

    assert response.status_code == 200
    body = response.get_json()
    assert len(body) == 1
    assert body[0]["description"] == "Courses de la semaine"


def test_get_expense_by_id(client, auth_headers):
    created = client.post(
        "/api/v1/expenses/", json=EXPENSE_PAYLOAD, headers=auth_headers
    ).get_json()["expense"]

    response = client.get(
        f"/api/v1/expenses/{created['expenseId']}", headers=auth_headers
    )

    assert response.status_code == 200
    assert response.get_json()["description"] == "Courses de la semaine"
    assert response.get_json()["expenseId"] == created["expenseId"]


def test_get_unknown_expense_returns_404(client, auth_headers):
    response = client.get("/api/v1/expenses/9999", headers=auth_headers)

    assert response.status_code == 404


def test_update_expense(client, auth_headers):
    created = client.post(
        "/api/v1/expenses/", json=EXPENSE_PAYLOAD, headers=auth_headers
    ).get_json()["expense"]

    response = client.put(
        f"/api/v1/expenses/{created['expenseId']}",
        json={"amount": 2000},
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.get_json()["expense"]["amount"] == 2000.0


def test_delete_expense_soft_deletes(client, auth_headers):
    created = client.post(
        "/api/v1/expenses/", json=EXPENSE_PAYLOAD, headers=auth_headers
    ).get_json()["expense"]

    response = client.delete(
        f"/api/v1/expenses/{created['expenseId']}", headers=auth_headers
    )

    assert response.status_code == 200
    assert client.get("/api/v1/expenses/", headers=auth_headers).get_json() == []


def test_create_expense_with_unknown_project_is_rejected(client, auth_headers):
    payload = {**EXPENSE_PAYLOAD, "projectId": 9999}

    response = client.post("/api/v1/expenses/", json=payload, headers=auth_headers)

    assert response.status_code == 400
    assert "errors" in response.get_json()


def test_expense_is_isolated_between_users(client, auth_headers, user_role_id):
    client.post("/api/v1/expenses/", json=EXPENSE_PAYLOAD, headers=auth_headers)

    other_payload = {
        "firstname": "Autre",
        "lastname": "Utilisateur",
        "email": "autre@budgetflow.test",
        "password": "motdepasse123",
        "roleId": user_role_id,
    }
    client.post("/api/v1/auth/register", json=other_payload)
    # La connexion remplace les cookies de session du client de test.
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "autre@budgetflow.test", "password": "motdepasse123"},
    )
    assert response.status_code == 200

    response = client.get("/api/v1/expenses/")

    assert response.get_json() == []

EXPENSE_PAYLOAD = {
    "amount": 1000,
    "category": "Alimentation",
    "description": "Courses",
    "date": "2026-01-15",
}

INCOME_PAYLOAD = {
    "amount": 50000,
    "source": "Salaire",
    "description": "Salaire janvier",
    "date": "2026-01-10",
}


def _create(client, headers, payload):
    response = client.post(
        "/api/v1/expenses/" if "category" in payload else "/api/v1/incomes/",
        json=payload,
        headers=headers,
    )
    assert response.status_code == 201, response.get_json()
    return response.get_json()


def _seed(client, headers, count=7):
    """Crée `count` dépenses et 2 revenus, avec des dates décroissantes."""
    for index in range(count):
        _create(
            client,
            headers,
            {
                "amount": 100 + index,
                "category": "Alimentation" if index % 2 == 0 else "Transport",
                "description": f"Dépense {index}",
                "date": f"2026-01-{index + 1:02d}",
            },
        )

    for index in range(2):
        _create(
            client,
            headers,
            {
                "amount": 5000 + index,
                "source": "Salaire",
                "description": f"Revenu {index}",
                "date": f"2026-01-{20 + index:02d}",
            },
        )


def test_transactions_are_paginated_with_five_items_by_default(client, auth_headers):
    _seed(client, auth_headers)

    body = client.get("/api/v1/transactions/", headers=auth_headers).get_json()

    assert len(body["items"]) == 5
    assert body["pagination"] == {
        "page": 1,
        "perPage": 5,
        "total": 9,
        "totalPages": 2,
        "hasPrevious": False,
        "hasNext": True,
    }
    # Les revenus (20 et 21 janvier) passent avant les dépenses.
    assert body["items"][0]["type"] == "income"
    assert body["items"][-1]["date"] == "2026-01-05"


def test_transactions_support_page_and_per_page(client, auth_headers):
    _seed(client, auth_headers)

    body = client.get(
        "/api/v1/transactions/?page=2&perPage=10", headers=auth_headers
    ).get_json()

    assert body["pagination"]["page"] == 1  # page 2 inexistante -> dernière page
    assert body["pagination"]["perPage"] == 10
    assert len(body["items"]) == 9

    body = client.get(
        "/api/v1/transactions/?page=2&perPage=5", headers=auth_headers
    ).get_json()

    assert len(body["items"]) == 4
    assert body["pagination"]["hasPrevious"] is True
    assert body["pagination"]["hasNext"] is False


def test_transactions_filter_by_type_and_compute_summary(client, auth_headers):
    _seed(client, auth_headers)

    body = client.get(
        "/api/v1/transactions/?type=income&perPage=10", headers=auth_headers
    ).get_json()

    assert {item["type"] for item in body["items"]} == {"income"}
    assert body["pagination"]["total"] == 2
    assert body["summary"] == {"incomes": 10001.0, "expenses": 0.0, "balance": 10001.0}


def test_transactions_filter_by_search_and_category(client, auth_headers):
    _seed(client, auth_headers)

    body = client.get(
        "/api/v1/transactions/?search=revenu&perPage=10", headers=auth_headers
    ).get_json()
    assert body["pagination"]["total"] == 2

    body = client.get(
        "/api/v1/transactions/?category=Transport&perPage=10", headers=auth_headers
    ).get_json()
    assert body["pagination"]["total"] == 3
    assert all(item["category"] == "Transport" for item in body["items"])
    assert "Alimentation" in body["categories"]


def test_transactions_reject_unknown_filters(client, auth_headers):
    assert (
        client.get("/api/v1/transactions/?type=salary", headers=auth_headers).status_code
        == 400
    )
    assert (
        client.get("/api/v1/transactions/?period=forever", headers=auth_headers).status_code
        == 400
    )


def test_transactions_are_isolated_between_users(client, auth_headers, user_role_id):
    _seed(client, auth_headers, count=1)

    client.post(
        "/api/v1/auth/register",
        json={
            "firstname": "Autre",
            "lastname": "Utilisateur",
            "email": "autre-transactions@budgetflow.test",
            "password": "motdepasse123",
            "roleId": user_role_id,
        },
    )
    client.post(
        "/api/v1/auth/login",
        json={"email": "autre-transactions@budgetflow.test", "password": "motdepasse123"},
    )

    # Les cookies de session appartiennent désormais à l'autre utilisateur.
    body = client.get("/api/v1/transactions/").get_json()

    assert body["items"] == []
    assert body["pagination"]["total"] == 0
    assert body["summary"]["incomes"] == 0

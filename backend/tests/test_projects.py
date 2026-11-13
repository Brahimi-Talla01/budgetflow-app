PROJECT_PAYLOAD = {
    "name": "Voyage",
    "targetAmount": 500000,
    "color": "#26D0FF",
}


def test_create_and_list_projects(client, auth_headers):
    created = client.post("/api/v1/projects/", json=PROJECT_PAYLOAD, headers=auth_headers)

    assert created.status_code == 201
    project = created.get_json()
    assert project["name"] == "Voyage"
    assert project["targetAmount"] == 500000.0

    response = client.get("/api/v1/projects/", headers=auth_headers)

    assert response.status_code == 200
    assert len(response.get_json()) == 1


def test_update_project(client, auth_headers):
    project = client.post(
        "/api/v1/projects/", json=PROJECT_PAYLOAD, headers=auth_headers
    ).get_json()

    response = client.put(
        f"/api/v1/projects/{project['projectId']}",
        json={"targetAmount": 750000},
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.get_json()["targetAmount"] == 750000.0


def test_delete_project(client, auth_headers):
    project = client.post(
        "/api/v1/projects/", json=PROJECT_PAYLOAD, headers=auth_headers
    ).get_json()

    response = client.delete(
        f"/api/v1/projects/{project['projectId']}", headers=auth_headers
    )

    assert response.status_code == 200
    assert client.get("/api/v1/projects/", headers=auth_headers).get_json() == []


def test_deleting_project_keeps_linked_transactions(client, auth_headers):
    project = client.post(
        "/api/v1/projects/", json=PROJECT_PAYLOAD, headers=auth_headers
    ).get_json()

    expense = client.post(
        "/api/v1/expenses/",
        json={
            "amount": 1500,
            "category": "Transport",
            "date": "2026-01-10",
            "projectId": project["projectId"],
        },
        headers=auth_headers,
    ).get_json()["expense"]

    response = client.delete(
        f"/api/v1/projects/{project['projectId']}", headers=auth_headers
    )
    assert response.status_code == 200

    remaining = client.get(
        f"/api/v1/expenses/{expense['expenseId']}", headers=auth_headers
    ).get_json()
    assert remaining["projectId"] is None


def test_project_stats_returns_progress(client, auth_headers):
    project = client.post(
        "/api/v1/projects/", json=PROJECT_PAYLOAD, headers=auth_headers
    ).get_json()

    client.post(
        "/api/v1/incomes/",
        json={
            "amount": 100000,
            "source": "Salaire",
            "date": "2026-01-10",
            "projectId": project["projectId"],
        },
        headers=auth_headers,
    )

    response = client.get(
        f"/api/v1/projects/{project['projectId']}/stats", headers=auth_headers
    )

    assert response.status_code == 200
    body = response.get_json()
    assert body["totalIncomes"] == 100000.0
    assert body["percent"] == 20.0

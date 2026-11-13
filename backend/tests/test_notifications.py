EXPENSE_PAYLOAD = {
    "amount": 42,
    "category": "Transport",
    "date": "2026-02-01",
}


def test_creating_expense_creates_notification(client, auth_headers):
    client.post("/api/v1/expenses/", json=EXPENSE_PAYLOAD, headers=auth_headers)

    response = client.get("/api/v1/notifications/", headers=auth_headers)

    assert response.status_code == 200
    notifications = response.get_json()
    assert len(notifications) == 1
    assert notifications[0]["title"] == "Nouvelle dépense"
    assert notifications[0]["isRead"] is False


def test_mark_notification_as_read(client, auth_headers):
    client.post("/api/v1/expenses/", json=EXPENSE_PAYLOAD, headers=auth_headers)
    notification = client.get("/api/v1/notifications/", headers=auth_headers).get_json()[0]

    response = client.patch(
        f"/api/v1/notifications/{notification['notificationId']}", headers=auth_headers
    )

    assert response.status_code == 200
    updated = client.get("/api/v1/notifications/", headers=auth_headers).get_json()[0]
    assert updated["isRead"] is True

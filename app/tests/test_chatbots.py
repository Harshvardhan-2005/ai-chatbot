def test_create_chatbot(
    client,
    auth_headers,
):
    response = client.post(
        "/chatbots",
        headers=auth_headers,
        json={
            "name": "AI Assistant",
            "description": "General purpose AI assistant",
            "model_name": "llama-test",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["name"] == "AI Assistant"
    assert (
        data["description"]
        == "General purpose AI assistant"
    )
    assert data["model_name"] == "llama-test"
    assert data["is_active"] is True

    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_create_chatbot_without_auth(client):
    response = client.post(
        "/chatbots",
        json={
            "name": "AI Assistant",
            "description": "General purpose AI assistant",
            "model_name": "llama-test",
        },
    )

    assert response.status_code == 401


def test_get_chatbot(
    client,
    auth_headers,
    test_chatbot,
):
    chatbot_id = test_chatbot["id"]

    response = client.get(
        f"/chatbots/{chatbot_id}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == chatbot_id
    assert data["name"] == "Test Chatbot"


def test_get_nonexistent_chatbot(
    client,
    auth_headers,
):
    response = client.get(
        "/chatbots/99999",
        headers=auth_headers,
    )

    assert response.status_code == 404

    assert (
        response.json()["detail"]
        == "Chatbot not found"
    )


def test_get_chatbots(
    client,
    auth_headers,
):
    for index in range(3):
        response = client.post(
            "/chatbots",
            headers=auth_headers,
            json={
                "name": f"Test Bot {index}",
                "description": (
                    f"Test chatbot number {index}"
                ),
                "model_name": "llama-test",
            },
        )

        assert response.status_code == 201

    response = client.get(
        "/chatbots",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 3


def test_chatbot_pagination(
    client,
    auth_headers,
):
    for index in range(5):
        response = client.post(
            "/chatbots",
            headers=auth_headers,
            json={
                "name": f"Test Bot {index}",
                "description": (
                    f"Test chatbot number {index}"
                ),
                "model_name": "llama-test",
            },
        )

        assert response.status_code == 201

    first_page = client.get(
        "/chatbots?page=1&size=2",
        headers=auth_headers,
    )

    second_page = client.get(
        "/chatbots?page=2&size=2",
        headers=auth_headers,
    )

    assert first_page.status_code == 200
    assert second_page.status_code == 200

    first_page_data = first_page.json()
    second_page_data = second_page.json()

    assert len(first_page_data) == 2
    assert len(second_page_data) == 2

    first_page_ids = {
        chatbot["id"]
        for chatbot in first_page_data
    }

    second_page_ids = {
        chatbot["id"]
        for chatbot in second_page_data
    }

    assert first_page_ids.isdisjoint(
        second_page_ids
    )


def test_search_chatbots(
    client,
    auth_headers,
):
    chatbots = [
        {
            "name": "Finance Assistant",
            "description": "Assistant for finance questions",
            "model_name": "llama-test",
        },
        {
            "name": "Coding Assistant",
            "description": "Assistant for coding questions",
            "model_name": "llama-test",
        },
        {
            "name": "Finance Analyst",
            "description": "Assistant for financial analysis",
            "model_name": "llama-test",
        },
    ]

    for chatbot in chatbots:
        response = client.post(
            "/chatbots",
            headers=auth_headers,
            json=chatbot,
        )

        assert response.status_code == 201

    response = client.get(
        "/chatbots/search?keyword=Finance",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 2

    assert all(
        "finance" in chatbot["name"].lower()
        for chatbot in data
    )


def test_update_chatbot(
    client,
    auth_headers,
    test_chatbot,
):
    chatbot_id = test_chatbot["id"]

    response = client.put(
        f"/chatbots/{chatbot_id}",
        headers=auth_headers,
        json={
            "name": "Updated Chatbot",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == "Updated Chatbot"

    assert (
        data["description"]
        == test_chatbot["description"]
    )

    assert (
        data["model_name"]
        == test_chatbot["model_name"]
    )


def test_delete_chatbot(
    client,
    auth_headers,
    test_chatbot,
):
    chatbot_id = test_chatbot["id"]

    delete_response = client.delete(
        f"/chatbots/{chatbot_id}",
        headers=auth_headers,
    )

    assert delete_response.status_code == 200

    assert (
        delete_response.json()["message"]
        == "Chatbot deleted successfully"
    )

    get_response = client.get(
        f"/chatbots/{chatbot_id}",
        headers=auth_headers,
    )

    assert get_response.status_code == 404


def test_user_cannot_access_another_users_chatbot(
    client,
    auth_headers,
    test_chatbot,
):
    chatbot_id = test_chatbot["id"]

    second_user_data = {
        "username": "seconduser",
        "email": "second@example.com",
        "password": "secondpassword123",
    }

    register_response = client.post(
        "/auth/register",
        json=second_user_data,
    )

    assert register_response.status_code == 201

    login_response = client.post(
        "/auth/login",
        data={
            "username": second_user_data["email"],
            "password": second_user_data["password"],
        },
    )

    assert login_response.status_code == 200

    second_user_token = (
        login_response.json()["access_token"]
    )

    second_user_headers = {
        "Authorization": (
            f"Bearer {second_user_token}"
        )
    }

    response = client.get(
        f"/chatbots/{chatbot_id}",
        headers=second_user_headers,
    )

    assert response.status_code == 404

    assert (
        response.json()["detail"]
        == "Chatbot not found"
    )

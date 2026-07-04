def create_conversation(
    client,
    auth_headers,
    chatbot_id,
    title="Test Conversation",
):
    return client.post(
        "/conversations",
        headers=auth_headers,
        json={
            "chatbot_id": chatbot_id,
            "title": title,
        },
    )


def test_create_conversation(
    client,
    auth_headers,
    test_chatbot,
):
    response = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    assert response.status_code == 201

    data = response.json()

    assert data["title"] == "Test Conversation"
    assert data["chatbot_id"] == test_chatbot["id"]
    assert "id" in data


def test_create_conversation_without_auth(
    client,
    test_chatbot,
):
    response = client.post(
        "/conversations",
        json={
            "chatbot_id": test_chatbot["id"],
            "title": "Unauthorized Conversation",
        },
    )

    assert response.status_code == 401


def test_create_conversation_for_nonexistent_chatbot(
    client,
    auth_headers,
):
    response = create_conversation(
        client,
        auth_headers,
        99999,
    )

    assert response.status_code == 404


def test_get_conversation(
    client,
    auth_headers,
    test_chatbot,
):
    create_response = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    conversation_id = create_response.json()["id"]

    response = client.get(
        f"/conversations/{conversation_id}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == conversation_id
    assert data["title"] == "Test Conversation"


def test_get_nonexistent_conversation(
    client,
    auth_headers,
):
    response = client.get(
        "/conversations/99999",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_get_conversations(
    client,
    auth_headers,
    test_chatbot,
):
    create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
        "Conversation One",
    )

    create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
        "Conversation Two",
    )

    response = client.get(
        "/conversations",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) >= 2


def test_conversation_pagination(
    client,
    auth_headers,
    test_chatbot,
):
    for index in range(5):
        create_conversation(
            client,
            auth_headers,
            test_chatbot["id"],
            f"Conversation {index}",
        )

    response = client.get(
        "/conversations?page=1&size=2",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 2


def test_search_conversations(
    client,
    auth_headers,
    test_chatbot,
):
    create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
        "Python Discussion",
    )

    create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
        "Database Discussion",
    )

    response = client.get(
        "/conversations/search?keyword=Python",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["title"] == "Python Discussion"


def test_update_conversation(
    client,
    auth_headers,
    test_chatbot,
):
    create_response = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    conversation_id = create_response.json()["id"]

    response = client.put(
        f"/conversations/{conversation_id}",
        headers=auth_headers,
        json={
            "title": "Updated Conversation",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["title"] == "Updated Conversation"


def test_delete_conversation(
    client,
    auth_headers,
    test_chatbot,
):
    create_response = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    conversation_id = create_response.json()["id"]

    response = client.delete(
        f"/conversations/{conversation_id}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    get_response = client.get(
        f"/conversations/{conversation_id}",
        headers=auth_headers,
    )

    assert get_response.status_code == 404


def test_user_cannot_access_another_users_conversation(
    client,
    auth_headers,
    test_chatbot,
):
    create_response = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    conversation_id = create_response.json()["id"]

    second_user = {
        "username": "seconduser",
        "email": "second@example.com",
        "password": "secondpassword123",
    }

    register_response = client.post(
        "/auth/register",
        json=second_user,
    )

    assert register_response.status_code == 201

    login_response = client.post(
        "/auth/login",
        data={
            "username": second_user["email"],
            "password": second_user["password"],
        },
    )

    assert login_response.status_code == 200

    second_token = login_response.json()[
        "access_token"
    ]

    second_headers = {
        "Authorization": (
            f"Bearer {second_token}"
        )
    }

    response = client.get(
        f"/conversations/{conversation_id}",
        headers=second_headers,
    )

    assert response.status_code == 404
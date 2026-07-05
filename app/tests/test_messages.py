def create_conversation(
    client,
    auth_headers,
    chatbot_id,
    title="Message Test Conversation",
):
    response = client.post(
        "/conversations",
        headers=auth_headers,
        json={
            "chatbot_id": chatbot_id,
            "title": title,
        },
    )

    assert response.status_code == 201

    return response.json()


def create_message(
    client,
    auth_headers,
    conversation_id,
    role="user",
    content="Test message",
):
    return client.post(
        "/messages",
        headers=auth_headers,
        json={
            "conversation_id": conversation_id,
            "role": role,
            "content": content,
        },
    )


def register_and_login(
    client,
    username,
    email,
    password="password123",
):
    register_response = client.post(
        "/auth/register",
        json={
            "username": username,
            "email": email,
            "password": password,
        },
    )

    assert register_response.status_code == 201

    login_response = client.post(
        "/auth/login",
        data={
            "username": email,
            "password": password,
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    return {
        "Authorization": f"Bearer {token}"
    }


def create_chatbot(
    client,
    auth_headers,
    name="Message Test Bot",
):
    response = client.post(
        "/chatbots",
        headers=auth_headers,
        json={
            "name": name,
            "description": "Chatbot for message tests",
            "model_name": "llama-test",
        },
    )

    assert response.status_code == 201

    return response.json()


def test_create_message(
    client,
    auth_headers,
    test_chatbot,
):
    conversation = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    response = create_message(
        client,
        auth_headers,
        conversation["id"],
        content="Hello Deneb",
    )

    assert response.status_code == 201

    data = response.json()

    assert data["conversation_id"] == conversation["id"]
    assert data["role"] == "user"
    assert data["content"] == "Hello Deneb"


def test_create_message_without_auth(
    client,
    auth_headers,
    test_chatbot,
):
    conversation = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    response = client.post(
        "/messages",
        json={
            "conversation_id": conversation["id"],
            "role": "user",
            "content": "Unauthorized message",
        },
    )

    assert response.status_code == 401


def test_create_message_for_nonexistent_conversation(
    client,
    auth_headers,
):
    response = create_message(
        client,
        auth_headers,
        999999,
    )

    assert response.status_code == 404


def test_get_message(
    client,
    auth_headers,
    test_chatbot,
):
    conversation = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    created = create_message(
        client,
        auth_headers,
        conversation["id"],
        content="Fetch this message",
    )

    assert created.status_code == 201

    message = created.json()

    response = client.get(
        f"/messages/{message['id']}",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["id"] == message["id"]


def test_get_nonexistent_message(
    client,
    auth_headers,
):
    response = client.get(
        "/messages/999999",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_get_messages(
    client,
    auth_headers,
    test_chatbot,
):
    conversation = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    create_message(
        client,
        auth_headers,
        conversation["id"],
        content="First message",
    )

    create_message(
        client,
        auth_headers,
        conversation["id"],
        content="Second message",
    )

    response = client.get(
        "/messages",
        headers=auth_headers,
    )

    assert response.status_code == 200

    contents = [
        message["content"]
        for message in response.json()
    ]

    assert "First message" in contents
    assert "Second message" in contents


def test_message_pagination(
    client,
    auth_headers,
    test_chatbot,
):
    conversation = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    for index in range(3):
        response = create_message(
            client,
            auth_headers,
            conversation["id"],
            content=f"Pagination message {index}",
        )

        assert response.status_code == 201

    response = client.get(
        "/messages?page=1&size=2",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert len(response.json()) == 2


def test_search_messages(
    client,
    auth_headers,
    test_chatbot,
):
    conversation = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    create_message(
        client,
        auth_headers,
        conversation["id"],
        content="DENEB_UNIQUE_SEARCH_CONTENT",
    )

    response = client.get(
        "/messages/search?keyword=UNIQUE_SEARCH",
        headers=auth_headers,
    )

    assert response.status_code == 200

    contents = [
        message["content"]
        for message in response.json()
    ]

    assert "DENEB_UNIQUE_SEARCH_CONTENT" in contents


def test_update_message(
    client,
    auth_headers,
    test_chatbot,
):
    conversation = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    created = create_message(
        client,
        auth_headers,
        conversation["id"],
        content="Original message",
    )

    assert created.status_code == 201

    message = created.json()

    response = client.put(
        f"/messages/{message['id']}",
        headers=auth_headers,
        json={
            "content": "Updated message",
        },
    )

    assert response.status_code == 200
    assert response.json()["content"] == "Updated message"


def test_delete_message(
    client,
    auth_headers,
    test_chatbot,
):
    conversation = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    created = create_message(
        client,
        auth_headers,
        conversation["id"],
        content="Delete this message",
    )

    assert created.status_code == 201

    message = created.json()

    response = client.delete(
        f"/messages/{message['id']}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    get_response = client.get(
        f"/messages/{message['id']}",
        headers=auth_headers,
    )

    assert get_response.status_code == 404


def test_message_rejects_empty_content(
    client,
    auth_headers,
    test_chatbot,
):
    conversation = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    response = create_message(
        client,
        auth_headers,
        conversation["id"],
        content="",
    )

    assert response.status_code == 422


def test_message_rejects_invalid_role(
    client,
    auth_headers,
    test_chatbot,
):
    conversation = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    response = create_message(
        client,
        auth_headers,
        conversation["id"],
        role="hacker",
    )

    assert response.status_code == 422


def test_message_rejects_invalid_page(
    client,
    auth_headers,
):
    response = client.get(
        "/messages?page=0&size=10",
        headers=auth_headers,
    )

    assert response.status_code == 422


def test_message_rejects_invalid_size(
    client,
    auth_headers,
):
    response = client.get(
        "/messages?page=1&size=0",
        headers=auth_headers,
    )

    assert response.status_code == 422


def test_message_rejects_excessive_page_size(
    client,
    auth_headers,
):
    response = client.get(
        "/messages?page=1&size=101",
        headers=auth_headers,
    )

    assert response.status_code == 422


def test_user_cannot_create_message_for_another_users_conversation(
    client,
    auth_headers,
    test_chatbot,
):
    conversation = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    other_headers = register_and_login(
        client,
        "other_message_user",
        "other-message@example.com",
    )

    response = create_message(
        client,
        other_headers,
        conversation["id"],
        content="Unauthorized access",
    )

    assert response.status_code == 404


def test_user_cannot_access_another_users_message(
    client,
    auth_headers,
    test_chatbot,
):
    conversation = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    created = create_message(
        client,
        auth_headers,
        conversation["id"],
        content="Private message",
    )

    assert created.status_code == 201

    message = created.json()

    other_headers = register_and_login(
        client,
        "message_intruder",
        "message-intruder@example.com",
    )

    response = client.get(
        f"/messages/{message['id']}",
        headers=other_headers,
    )

    assert response.status_code == 404


def test_user_cannot_update_another_users_message(
    client,
    auth_headers,
    test_chatbot,
):
    conversation = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    created = create_message(
        client,
        auth_headers,
        conversation["id"],
        content="Owner content",
    )

    assert created.status_code == 201

    message = created.json()

    other_headers = register_and_login(
        client,
        "message_updater",
        "message-updater@example.com",
    )

    response = client.put(
        f"/messages/{message['id']}",
        headers=other_headers,
        json={
            "content": "Hijacked content",
        },
    )

    assert response.status_code == 404


def test_user_cannot_delete_another_users_message(
    client,
    auth_headers,
    test_chatbot,
):
    conversation = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    created = create_message(
        client,
        auth_headers,
        conversation["id"],
        content="Protected message",
    )

    assert created.status_code == 201

    message = created.json()

    other_headers = register_and_login(
        client,
        "message_deleter",
        "message-deleter@example.com",
    )

    response = client.delete(
        f"/messages/{message['id']}",
        headers=other_headers,
    )

    assert response.status_code == 404


def test_user_only_lists_own_messages(
    client,
    auth_headers,
    test_chatbot,
):
    owner_conversation = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    create_message(
        client,
        auth_headers,
        owner_conversation["id"],
        content="OWNER_MESSAGE_CONTENT",
    )

    other_headers = register_and_login(
        client,
        "message_list_user",
        "message-list@example.com",
    )

    other_chatbot = create_chatbot(
        client,
        other_headers,
        name="Other Message Bot",
    )

    other_conversation = create_conversation(
        client,
        other_headers,
        other_chatbot["id"],
        title="Other Conversation",
    )

    create_message(
        client,
        other_headers,
        other_conversation["id"],
        content="OTHER_MESSAGE_CONTENT",
    )

    response = client.get(
        "/messages",
        headers=auth_headers,
    )

    assert response.status_code == 200

    combined_content = " ".join(
        message["content"]
        for message in response.json()
    )

    assert "OWNER_MESSAGE_CONTENT" in combined_content
    assert "OTHER_MESSAGE_CONTENT" not in combined_content


def test_user_searches_only_own_messages(
    client,
    auth_headers,
    test_chatbot,
):
    owner_conversation = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    create_message(
        client,
        auth_headers,
        owner_conversation["id"],
        content="SHARED_KEYWORD_OWNER",
    )

    other_headers = register_and_login(
        client,
        "message_search_user",
        "message-search@example.com",
    )

    other_chatbot = create_chatbot(
        client,
        other_headers,
        name="Search Message Bot",
    )

    other_conversation = create_conversation(
        client,
        other_headers,
        other_chatbot["id"],
        title="Search Conversation",
    )

    create_message(
        client,
        other_headers,
        other_conversation["id"],
        content="SHARED_KEYWORD_OTHER",
    )

    response = client.get(
        "/messages/search?keyword=SHARED_KEYWORD",
        headers=auth_headers,
    )

    assert response.status_code == 200

    combined_content = " ".join(
        message["content"]
        for message in response.json()
    )

    assert "SHARED_KEYWORD_OWNER" in combined_content
    assert "SHARED_KEYWORD_OTHER" not in combined_content

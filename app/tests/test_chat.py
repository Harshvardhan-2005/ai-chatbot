from unittest.mock import patch


def create_conversation(
    client,
    auth_headers,
    chatbot_id,
    title="New Conversation",
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


@patch(
    "app.services.chat_service.generate_response"
)
@patch(
    "app.services.chat_service.generate_title"
)
def test_chat_first_message(
    mock_generate_title,
    mock_generate_response,
    client,
    auth_headers,
    test_chatbot,
):
    mock_generate_title.return_value = (
        "Introduction to Harsh"
    )

    mock_generate_response.return_value = (
        "Hello Harsh!"
    )

    conversation = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    response = client.post(
        "/chat",
        headers=auth_headers,
        json={
            "conversation_id": conversation["id"],
            "message": "My name is Harsh.",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["conversation_id"] == (
        conversation["id"]
    )

    assert data["user_message"] == (
        "My name is Harsh."
    )

    assert data["assistant_message"] == (
        "Hello Harsh!"
    )

    mock_generate_title.assert_called_once_with(
        "My name is Harsh."
    )

    mock_generate_response.assert_called_once_with(
        [
            {
                "role": "user",
                "content": "My name is Harsh.",
            }
        ]
    )


@patch(
    "app.services.chat_service.generate_response"
)
@patch(
    "app.services.chat_service.generate_title"
)
def test_chat_persists_messages(
    mock_generate_title,
    mock_generate_response,
    client,
    auth_headers,
    test_chatbot,
    db,
):
    from app.models.message import Message

    mock_generate_title.return_value = (
        "Persistence Test"
    )

    mock_generate_response.return_value = (
        "Stored response"
    )

    conversation = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    response = client.post(
        "/chat",
        headers=auth_headers,
        json={
            "conversation_id": conversation["id"],
            "message": "Store this message",
        },
    )

    assert response.status_code == 200

    messages = (
        db.query(Message)
        .filter(
            Message.conversation_id
            == conversation["id"]
        )
        .order_by(Message.created_at)
        .all()
    )

    assert len(messages) == 2

    assert messages[0].role == "user"

    assert messages[0].content == (
        "Store this message"
    )

    assert messages[1].role == "assistant"

    assert messages[1].content == (
        "Stored response"
    )


@patch(
    "app.services.chat_service.generate_response"
)
@patch(
    "app.services.chat_service.generate_title"
)
def test_chat_generates_title_on_first_message(
    mock_generate_title,
    mock_generate_response,
    client,
    auth_headers,
    test_chatbot,
    db,
):
    from app.models.conversation import Conversation

    mock_generate_title.return_value = (
        "Generated Test Title"
    )

    mock_generate_response.return_value = (
        "AI response"
    )

    conversation = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    response = client.post(
        "/chat",
        headers=auth_headers,
        json={
            "conversation_id": conversation["id"],
            "message": "Explain Python decorators",
        },
    )

    assert response.status_code == 200

    db.expire_all()

    saved_conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id
            == conversation["id"]
        )
        .first()
    )

    assert saved_conversation.title == (
        "Generated Test Title"
    )

    mock_generate_title.assert_called_once_with(
        "Explain Python decorators"
    )


@patch(
    "app.services.chat_service.generate_response"
)
@patch(
    "app.services.chat_service.generate_title"
)
def test_chat_uses_conversation_history(
    mock_generate_title,
    mock_generate_response,
    client,
    auth_headers,
    test_chatbot,
):
    mock_generate_title.return_value = (
        "Harsh Introduction"
    )

    mock_generate_response.side_effect = [
        "Hello Harsh!",
        "Your name is Harsh.",
    ]

    conversation = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    first_response = client.post(
        "/chat",
        headers=auth_headers,
        json={
            "conversation_id": conversation["id"],
            "message": "My name is Harsh.",
        },
    )

    assert first_response.status_code == 200

    second_response = client.post(
        "/chat",
        headers=auth_headers,
        json={
            "conversation_id": conversation["id"],
            "message": "What is my name?",
        },
    )

    assert second_response.status_code == 200

    assert second_response.json()[
        "assistant_message"
    ] == "Your name is Harsh."

    assert mock_generate_response.call_count == 2

    second_call_messages = (
        mock_generate_response.call_args_list[1]
        .args[0]
    )

    assert second_call_messages == [
        {
            "role": "user",
            "content": "My name is Harsh.",
        },
        {
            "role": "assistant",
            "content": "Hello Harsh!",
        },
        {
            "role": "user",
            "content": "What is my name?",
        },
    ]

    mock_generate_title.assert_called_once()


@patch(
    "app.services.chat_service.generate_response"
)
@patch(
    "app.services.chat_service.generate_title"
)
def test_chat_does_not_regenerate_title(
    mock_generate_title,
    mock_generate_response,
    client,
    auth_headers,
    test_chatbot,
):
    mock_generate_title.return_value = (
        "Original Title"
    )

    mock_generate_response.side_effect = [
        "First response",
        "Second response",
    ]

    conversation = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    first_response = client.post(
        "/chat",
        headers=auth_headers,
        json={
            "conversation_id": conversation["id"],
            "message": "First message",
        },
    )

    assert first_response.status_code == 200

    second_response = client.post(
        "/chat",
        headers=auth_headers,
        json={
            "conversation_id": conversation["id"],
            "message": "Second message",
        },
    )

    assert second_response.status_code == 200

    mock_generate_title.assert_called_once_with(
        "First message"
    )


@patch(
    "app.services.chat_service.generate_response"
)
def test_chat_nonexistent_conversation(
    mock_generate_response,
    client,
    auth_headers,
):
    response = client.post(
        "/chat",
        headers=auth_headers,
        json={
            "conversation_id": 99999,
            "message": "Hello",
        },
    )

    assert response.status_code == 404

    assert response.json()["detail"] == (
        "Conversation not found."
    )

    mock_generate_response.assert_not_called()


def test_chat_empty_message(
    client,
    auth_headers,
):
    response = client.post(
        "/chat",
        headers=auth_headers,
        json={
            "conversation_id": 1,
            "message": "",
        },
    )

    assert response.status_code == 422


def test_chat_message_exceeds_max_length(
    client,
    auth_headers,
):
    response = client.post(
        "/chat",
        headers=auth_headers,
        json={
            "conversation_id": 1,
            "message": "a" * 5001,
        },
    )

    assert response.status_code == 422


def test_chat_requires_authentication(
    client,
):
    response = client.post(
        "/chat",
        json={
            "conversation_id": 1,
            "message": "Hello",
        },
    )

    assert response.status_code == 401


@patch(
    "app.services.chat_service.generate_response"
)
def test_user_cannot_chat_with_another_users_conversation(
    mock_generate_response,
    client,
    auth_headers,
    test_chatbot,
):
    conversation = create_conversation(
        client,
        auth_headers,
        test_chatbot["id"],
    )

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

    response = client.post(
        "/chat",
        headers=second_headers,
        json={
            "conversation_id": conversation["id"],
            "message": "Read this conversation",
        },
    )

    assert response.status_code == 404

    assert response.json()["detail"] == (
        "Conversation not found."
    )

    mock_generate_response.assert_not_called()
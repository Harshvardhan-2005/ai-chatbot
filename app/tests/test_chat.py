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

def test_chat_uses_chatbot_knowledge(
    client,
    auth_headers,
    test_chatbot,
    monkeypatch,
):
    knowledge_response = client.post(
        "/knowledge-bases",
        headers=auth_headers,
        json={
            "chatbot_id": test_chatbot["id"],
            "title": "Company Policy",
            "source_type": "text",
            "content": (
                "Employees receive 25 annual leave days."
            ),
        },
    )

    assert knowledge_response.status_code == 201

    conversation_response = client.post(
        "/conversations",
        headers=auth_headers,
        json={
            "chatbot_id": test_chatbot["id"],
            "title": "Knowledge Chat",
        },
    )

    assert conversation_response.status_code == 201

    conversation = conversation_response.json()

    captured_messages = []

    def mock_generate_response(messages):
        captured_messages.extend(messages)
        return "Employees receive 25 annual leave days."

    monkeypatch.setattr(
        "app.services.chat_service.generate_response",
        mock_generate_response,
    )

    monkeypatch.setattr(
        "app.services.chat_service.generate_title",
        lambda message: "Leave Policy",
    )

    response = client.post(
        "/chat",
        headers=auth_headers,
        json={
            "conversation_id": conversation["id"],
            "message": (
                "How many annual leave days do employees get?"
            ),
        },
    )

    assert response.status_code == 200

    system_messages = [
        message
        for message in captured_messages
        if message["role"] == "system"
    ]

    assert len(system_messages) == 1

    assert (
        "Employees receive 25 annual leave days."
        in system_messages[0]["content"]
    )


def test_chat_uses_only_current_chatbot_knowledge(
    client,
    auth_headers,
    monkeypatch,
):
    first_chatbot_response = client.post(
        "/chatbots",
        headers=auth_headers,
        json={
            "name": "HR Bot",
            "description": "HR assistant",
            "model_name": "llama-test",
        },
    )

    second_chatbot_response = client.post(
        "/chatbots",
        headers=auth_headers,
        json={
            "name": "Finance Bot",
            "description": "Finance assistant",
            "model_name": "llama-test",
        },
    )

    assert first_chatbot_response.status_code == 201
    assert second_chatbot_response.status_code == 201

    first_chatbot = first_chatbot_response.json()
    second_chatbot = second_chatbot_response.json()

    first_knowledge_response = client.post(
        "/knowledge-bases",
        headers=auth_headers,
        json={
            "chatbot_id": first_chatbot["id"],
            "title": "HR Policy",
            "source_type": "text",
            "content": "HR_SECRET_KNOWLEDGE",
        },
    )

    second_knowledge_response = client.post(
        "/knowledge-bases",
        headers=auth_headers,
        json={
            "chatbot_id": second_chatbot["id"],
            "title": "Finance Policy",
            "source_type": "text",
            "content": "FINANCE_SECRET_KNOWLEDGE",
        },
    )

    assert first_knowledge_response.status_code == 201
    assert second_knowledge_response.status_code == 201

    conversation_response = client.post(
        "/conversations",
        headers=auth_headers,
        json={
            "chatbot_id": first_chatbot["id"],
            "title": "HR Conversation",
        },
    )

    assert conversation_response.status_code == 201

    conversation = conversation_response.json()

    captured_messages = []

    def mock_generate_response(messages):
        captured_messages.extend(messages)
        return "Knowledge response"

    monkeypatch.setattr(
        "app.services.chat_service.generate_response",
        mock_generate_response,
    )

    monkeypatch.setattr(
        "app.services.chat_service.generate_title",
        lambda message: "Knowledge Test",
    )

    response = client.post(
        "/chat",
        headers=auth_headers,
        json={
            "conversation_id": conversation["id"],
            "message": "Answer using your knowledge.",
        },
    )

    assert response.status_code == 200

    combined_content = " ".join(
        message["content"]
        for message in captured_messages
    )

    assert "HR_SECRET_KNOWLEDGE" in combined_content

    assert (
        "FINANCE_SECRET_KNOWLEDGE"
        not in combined_content
    )


def test_chat_without_knowledge_still_works(
    client,
    auth_headers,
    test_chatbot,
    monkeypatch,
):
    conversation_response = client.post(
        "/conversations",
        headers=auth_headers,
        json={
            "chatbot_id": test_chatbot["id"],
            "title": "General Chat",
        },
    )

    assert conversation_response.status_code == 201

    conversation = conversation_response.json()

    captured_messages = []

    def mock_generate_response(messages):
        captured_messages.extend(messages)
        return "General AI response"

    monkeypatch.setattr(
        "app.services.chat_service.generate_response",
        mock_generate_response,
    )

    monkeypatch.setattr(
        "app.services.chat_service.generate_title",
        lambda message: "General Chat",
    )

    response = client.post(
        "/chat",
        headers=auth_headers,
        json={
            "conversation_id": conversation["id"],
            "message": "Hello AI",
        },
    )

    assert response.status_code == 200

    assert response.json()["assistant_message"] == (
        "General AI response"
    )

    system_messages = [
        message
        for message in captured_messages
        if message["role"] == "system"
    ]

    assert len(system_messages) == 0


def test_knowledge_context_preserves_conversation_history(
    client,
    auth_headers,
    test_chatbot,
    monkeypatch,
):
    knowledge_response = client.post(
        "/knowledge-bases",
        headers=auth_headers,
        json={
            "chatbot_id": test_chatbot["id"],
            "title": "Product Knowledge",
            "source_type": "text",
            "content": "Deneb supports AI chatbots.",
        },
    )

    assert knowledge_response.status_code == 201

    conversation_response = client.post(
        "/conversations",
        headers=auth_headers,
        json={
            "chatbot_id": test_chatbot["id"],
            "title": "Deneb Chat",
        },
    )

    assert conversation_response.status_code == 201

    conversation = conversation_response.json()

    captured_calls = []

    def mock_generate_response(messages):
        captured_calls.append(
            [message.copy() for message in messages]
        )
        return "AI response"

    monkeypatch.setattr(
        "app.services.chat_service.generate_response",
        mock_generate_response,
    )

    monkeypatch.setattr(
        "app.services.chat_service.generate_title",
        lambda message: "Deneb Chat",
    )

    first_response = client.post(
        "/chat",
        headers=auth_headers,
        json={
            "conversation_id": conversation["id"],
            "message": "What does Deneb support?",
        },
    )

    assert first_response.status_code == 200

    second_response = client.post(
        "/chat",
        headers=auth_headers,
        json={
            "conversation_id": conversation["id"],
            "message": "Tell me again.",
        },
    )

    assert second_response.status_code == 200

    second_call = captured_calls[1]

    roles = [
        message["role"]
        for message in second_call
    ]

    assert roles[0] == "system"

    assert "user" in roles
    assert "assistant" in roles

    combined_content = " ".join(
        message["content"]
        for message in second_call
    )

    assert "Deneb supports AI chatbots." in combined_content
    assert "What does Deneb support?" in combined_content
    assert "Tell me again." in combined_content

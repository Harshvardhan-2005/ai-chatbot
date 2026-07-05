def create_knowledge_base(
    client,
    auth_headers,
    chatbot_id,
    title="Python Knowledge",
    source_type="text",
    content="Python is a programming language.",
):
    response = client.post(
        "/knowledge-bases",
        headers=auth_headers,
        json={
            "chatbot_id": chatbot_id,
            "title": title,
            "source_type": source_type,
            "content": content,
        },
    )

    assert response.status_code == 201

    return response.json()


def test_create_knowledge_base(
    client,
    auth_headers,
    test_chatbot,
):
    response = client.post(
        "/knowledge-bases",
        headers=auth_headers,
        json={
            "chatbot_id": test_chatbot["id"],
            "title": "Python Documentation",
            "source_type": "text",
            "content": (
                "Python is a high-level "
                "programming language."
            ),
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["title"] == "Python Documentation"
    assert data["source_type"] == "text"
    assert data["chatbot_id"] == test_chatbot["id"]
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_create_knowledge_base_without_auth(
    client,
    test_chatbot,
):
    response = client.post(
        "/knowledge-bases",
        json={
            "chatbot_id": test_chatbot["id"],
            "title": "Unauthorized Knowledge",
            "source_type": "text",
            "content": "Secret content",
        },
    )

    assert response.status_code == 401


def test_create_knowledge_base_for_nonexistent_chatbot(
    client,
    auth_headers,
):
    response = client.post(
        "/knowledge-bases",
        headers=auth_headers,
        json={
            "chatbot_id": 999999,
            "title": "Invalid Knowledge",
            "source_type": "text",
            "content": "Invalid chatbot content",
        },
    )

    assert response.status_code == 404


def test_get_knowledge_base(
    client,
    auth_headers,
    test_chatbot,
):
    knowledge_base = create_knowledge_base(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    response = client.get(
        f"/knowledge-bases/{knowledge_base['id']}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == knowledge_base["id"]
    assert data["title"] == knowledge_base["title"]


def test_get_nonexistent_knowledge_base(
    client,
    auth_headers,
):
    response = client.get(
        "/knowledge-bases/999999",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_get_knowledge_bases(
    client,
    auth_headers,
    test_chatbot,
):
    create_knowledge_base(
        client,
        auth_headers,
        test_chatbot["id"],
        title="Knowledge One",
    )

    create_knowledge_base(
        client,
        auth_headers,
        test_chatbot["id"],
        title="Knowledge Two",
    )

    response = client.get(
        "/knowledge-bases",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 2

    titles = {
        knowledge_base["title"]
        for knowledge_base in data
    }

    assert "Knowledge One" in titles
    assert "Knowledge Two" in titles


def test_knowledge_base_pagination(
    client,
    auth_headers,
    test_chatbot,
):
    for index in range(5):
        create_knowledge_base(
            client,
            auth_headers,
            test_chatbot["id"],
            title=f"Knowledge {index}",
        )

    response = client.get(
        "/knowledge-bases?page=2&size=2",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 2


def test_search_knowledge_bases(
    client,
    auth_headers,
    test_chatbot,
):
    create_knowledge_base(
        client,
        auth_headers,
        test_chatbot["id"],
        title="Python Documentation",
    )

    create_knowledge_base(
        client,
        auth_headers,
        test_chatbot["id"],
        title="Java Documentation",
    )

    response = client.get(
        "/knowledge-bases/search?keyword=Python",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["title"] == "Python Documentation"


def test_update_knowledge_base(
    client,
    auth_headers,
    test_chatbot,
):
    knowledge_base = create_knowledge_base(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    response = client.put(
        f"/knowledge-bases/{knowledge_base['id']}",
        headers=auth_headers,
        json={
            "title": "Updated Knowledge",
            "content": "Updated knowledge content",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["title"] == "Updated Knowledge"
    assert data["content"] == "Updated knowledge content"
    assert data["source_type"] == "text"


def test_delete_knowledge_base(
    client,
    auth_headers,
    test_chatbot,
):
    knowledge_base = create_knowledge_base(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    response = client.delete(
        f"/knowledge-bases/{knowledge_base['id']}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    assert response.json() == {
        "message": (
            "Knowledge Base deleted successfully"
        )
    }

    get_response = client.get(
        f"/knowledge-bases/{knowledge_base['id']}",
        headers=auth_headers,
    )

    assert get_response.status_code == 404


def test_user_cannot_access_another_users_knowledge_base(
    client,
    auth_headers,
    test_chatbot,
):
    knowledge_base = create_knowledge_base(
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
        "Authorization": f"Bearer {second_token}"
    }

    response = client.get(
        f"/knowledge-bases/{knowledge_base['id']}",
        headers=second_headers,
    )

    assert response.status_code == 404


def test_user_cannot_create_knowledge_base_for_another_users_chatbot(
    client,
    auth_headers,
    test_chatbot,
):
    second_user = {
        "username": "anotheruser",
        "email": "another@example.com",
        "password": "anotherpassword123",
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
        "Authorization": f"Bearer {second_token}"
    }

    response = client.post(
        "/knowledge-bases",
        headers=second_headers,
        json={
            "chatbot_id": test_chatbot["id"],
            "title": "Unauthorized Knowledge",
            "source_type": "text",
            "content": "Should not be created",
        },
    )

    assert response.status_code == 404

def test_knowledge_base_rejects_empty_title(
    client,
    auth_headers,
    test_chatbot,
):
    response = client.post(
        "/knowledge-bases",
        headers=auth_headers,
        json={
            "chatbot_id": test_chatbot["id"],
            "title": "",
            "source_type": "text",
            "content": "Valid knowledge content",
        },
    )

    assert response.status_code == 422


def test_knowledge_base_rejects_empty_content(
    client,
    auth_headers,
    test_chatbot,
):
    response = client.post(
        "/knowledge-bases",
        headers=auth_headers,
        json={
            "chatbot_id": test_chatbot["id"],
            "title": "Valid Knowledge",
            "source_type": "text",
            "content": "",
        },
    )

    assert response.status_code == 422


def test_knowledge_base_rejects_invalid_source_type(
    client,
    auth_headers,
    test_chatbot,
):
    response = client.post(
        "/knowledge-bases",
        headers=auth_headers,
        json={
            "chatbot_id": test_chatbot["id"],
            "title": "Invalid Source",
            "source_type": "random-source",
            "content": "Valid knowledge content",
        },
    )

    assert response.status_code == 422


def test_knowledge_base_rejects_invalid_page(
    client,
    auth_headers,
):
    response = client.get(
        "/knowledge-bases?page=0&size=10",
        headers=auth_headers,
    )

    assert response.status_code == 422


def test_knowledge_base_rejects_invalid_size(
    client,
    auth_headers,
):
    response = client.get(
        "/knowledge-bases?page=1&size=0",
        headers=auth_headers,
    )

    assert response.status_code == 422


def test_knowledge_base_rejects_excessive_page_size(
    client,
    auth_headers,
):
    response = client.get(
        "/knowledge-bases?page=1&size=101",
        headers=auth_headers,
    )

    assert response.status_code == 422


def test_user_cannot_update_another_users_knowledge_base(
    client,
    auth_headers,
    test_chatbot,
):
    knowledge_base = create_knowledge_base(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    second_user = {
        "username": "updateuser",
        "email": "update@example.com",
        "password": "updatepassword123",
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

    second_headers = {
        "Authorization": (
            f"Bearer "
            f"{login_response.json()['access_token']}"
        )
    }

    response = client.put(
        f"/knowledge-bases/{knowledge_base['id']}",
        headers=second_headers,
        json={
            "title": "Unauthorized Update",
        },
    )

    assert response.status_code == 404


def test_user_cannot_delete_another_users_knowledge_base(
    client,
    auth_headers,
    test_chatbot,
):
    knowledge_base = create_knowledge_base(
        client,
        auth_headers,
        test_chatbot["id"],
    )

    second_user = {
        "username": "deleteuser",
        "email": "delete@example.com",
        "password": "deletepassword123",
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

    second_headers = {
        "Authorization": (
            f"Bearer "
            f"{login_response.json()['access_token']}"
        )
    }

    response = client.delete(
        f"/knowledge-bases/{knowledge_base['id']}",
        headers=second_headers,
    )

    assert response.status_code == 404


def test_user_only_lists_own_knowledge_bases(
    client,
    auth_headers,
    test_chatbot,
):
    create_knowledge_base(
        client,
        auth_headers,
        test_chatbot["id"],
        title="First User Knowledge",
    )

    second_user = {
        "username": "isolationuser",
        "email": "isolation@example.com",
        "password": "isolationpassword123",
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

    second_headers = {
        "Authorization": (
            f"Bearer "
            f"{login_response.json()['access_token']}"
        )
    }

    response = client.get(
        "/knowledge-bases",
        headers=second_headers,
    )

    assert response.status_code == 200
    assert response.json() == []


def test_user_searches_only_own_knowledge_bases(
    client,
    auth_headers,
    test_chatbot,
):
    create_knowledge_base(
        client,
        auth_headers,
        test_chatbot["id"],
        title="Secret Python Knowledge",
    )

    second_user = {
        "username": "searchuser",
        "email": "search@example.com",
        "password": "searchpassword123",
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

    second_headers = {
        "Authorization": (
            f"Bearer "
            f"{login_response.json()['access_token']}"
        )
    }

    response = client.get(
        "/knowledge-bases/search?keyword=Python",
        headers=second_headers,
    )

    assert response.status_code == 200
    assert response.json() == []

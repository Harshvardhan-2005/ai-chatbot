def test_register_user(client):
    response = client.post(
        "/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpassword123",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"
    assert data["is_active"] is True

    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data

    assert "password" not in data
    assert "hashed_password" not in data


def test_register_duplicate_email(client):
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword123",
    }

    first_response = client.post(
        "/auth/register",
        json=user_data,
    )

    assert first_response.status_code == 201

    duplicate_response = client.post(
        "/auth/register",
        json={
            "username": "differentuser",
            "email": "test@example.com",
            "password": "testpassword123",
        },
    )

    assert duplicate_response.status_code == 400

    assert (
        duplicate_response.json()["detail"]
        == "Email already registered"
    )


def test_register_duplicate_username(client):
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword123",
    }

    first_response = client.post(
        "/auth/register",
        json=user_data,
    )

    assert first_response.status_code == 201

    duplicate_response = client.post(
        "/auth/register",
        json={
            "username": "testuser",
            "email": "different@example.com",
            "password": "testpassword123",
        },
    )

    assert duplicate_response.status_code == 400

    assert (
        duplicate_response.json()["detail"]
        == "Username already exists"
    )


def test_login_success(client):
    client.post(
        "/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpassword123",
        },
    )

    response = client.post(
        "/auth/login",
        data={
            "username": "test@example.com",
            "password": "testpassword123",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["access_token"]
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client):
    client.post(
        "/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpassword123",
        },
    )

    response = client.post(
        "/auth/login",
        data={
            "username": "test@example.com",
            "password": "wrongpassword",
        },
    )

    assert response.status_code == 401

    assert (
        response.json()["detail"]
        == "Invalid email or password"
    )


def test_login_nonexistent_user(client):
    response = client.post(
        "/auth/login",
        data={
            "username": "missing@example.com",
            "password": "testpassword123",
        },
    )

    assert response.status_code == 401

    assert (
        response.json()["detail"]
        == "Invalid email or password"
    )
import pytest

from fastapi.testclient import TestClient

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database.base import Base
from app.database.session import get_db
from app.main import app

# Import models so SQLAlchemy registers all tables
from app.models.user import User
from app.models.chatbot import Chatbot
from app.models.knowledge_base import KnowledgeBase
from app.models.conversation import Conversation
from app.models.message import Message


TEST_DATABASE_URL = "sqlite:///./test.db"


test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={
        "check_same_thread": False,
    },
)


TestingSessionLocal = sessionmaker(
    bind=test_engine,
    autocommit=False,
    autoflush=False,
)


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    Base.metadata.create_all(
        bind=test_engine
    )

    yield

    Base.metadata.drop_all(
        bind=test_engine
    )


@pytest.fixture
def db():
    connection = test_engine.connect()

    transaction = connection.begin()

    session = TestingSessionLocal(
        bind=connection
    )

    try:
        yield session

    finally:
        session.close()

        transaction.rollback()

        connection.close()


@pytest.fixture
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = (
        override_get_db
    )

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


@pytest.fixture
def test_user(client):
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword123",
    }

    response = client.post(
        "/auth/register",
        json=user_data,
    )

    assert response.status_code == 201

    return {
        **response.json(),
        "password": user_data["password"],
    }


@pytest.fixture
def auth_headers(
    client,
    test_user,
):
    response = client.post(
        "/auth/login",
        data={
            "username": test_user["email"],
            "password": test_user["password"],
        },
    )

    assert response.status_code == 200

    token = response.json()["access_token"]

    return {
        "Authorization": f"Bearer {token}"
    }


@pytest.fixture
def test_chatbot(
    client,
    auth_headers,
):
    response = client.post(
        "/chatbots",
        headers=auth_headers,
        json={
            "name": "Test Chatbot",
            "description": (
                "Chatbot created for testing"
            ),
            "model_name": "llama-test",
        },
    )

    assert response.status_code == 201

    return response.json()
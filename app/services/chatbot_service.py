from sqlalchemy.orm import Session

import app.repositories.chatbot_repository as chatbot_repository
from app.schemas.chatbot import (
    ChatbotCreate,
    ChatbotUpdate,
)


def create_chatbot(
    db: Session,
    chatbot: ChatbotCreate,
):
    return chatbot_repository.create_chatbot(
        db,
        chatbot,
    )


def get_chatbot(
    db: Session,
    chatbot_id: int,
):
    return chatbot_repository.get_chatbot(
        db,
        chatbot_id,
    )


def get_chatbots(
    db: Session,
    skip: int,
    limit: int,
):
    return chatbot_repository.get_chatbots(
        db,
        skip,
        limit,
    )


def search_chatbots(
    db: Session,
    keyword: str,
):
    return chatbot_repository.search_chatbots(
        db,
        keyword,
    )


def update_chatbot(
    db: Session,
    chatbot_id: int,
    chatbot: ChatbotUpdate,
):
    return chatbot_repository.update_chatbot(
        db,
        chatbot_id,
        chatbot,
    )


def delete_chatbot(
    db: Session,
    chatbot_id: int,
):
    return chatbot_repository.delete_chatbot(
        db,
        chatbot_id,
    )
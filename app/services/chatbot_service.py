from sqlalchemy.orm import Session

import app.repositories.chatbot_repository as chatbot_repository
from app.schemas.chatbot import (
    ChatbotCreate,
    ChatbotUpdate,
)


def create_chatbot(
    db: Session,
    chatbot: ChatbotCreate,
    owner_id: int,
):
    return chatbot_repository.create_chatbot(
        db,
        chatbot,
        owner_id,
    )


def get_chatbot(
    db: Session,
    chatbot_id: int,
    owner_id: int,
):
    return chatbot_repository.get_chatbot(
        db,
        chatbot_id,
        owner_id,
    )


def get_chatbots(
    db: Session,
    owner_id: int,
    skip: int,
    limit: int,
):
    return chatbot_repository.get_chatbots(
        db,
        owner_id,
        skip,
        limit,
    )


def search_chatbots(
    db: Session,
    owner_id: int,
    keyword: str,
):
    return chatbot_repository.search_chatbots(
        db,
        owner_id,
        keyword,
    )


def update_chatbot(
    db: Session,
    chatbot_id: int,
    chatbot: ChatbotUpdate,
    owner_id: int,
):
    return chatbot_repository.update_chatbot(
        db,
        chatbot_id,
        chatbot,
        owner_id,
    )


def delete_chatbot(
    db: Session,
    chatbot_id: int,
    owner_id: int,
):
    return chatbot_repository.delete_chatbot(
        db,
        chatbot_id,
        owner_id,
    )
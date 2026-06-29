from sqlalchemy.orm import Session

import app.repositories.conversation_repository as conversation_repository

from app.schemas.conversation import (
    ConversationCreate,
    ConversationUpdate,
)


def create_conversation(
    db: Session,
    conversation: ConversationCreate,
):
    return conversation_repository.create_conversation(
        db,
        conversation,
    )


def get_conversation(
    db: Session,
    conversation_id: int,
):
    return conversation_repository.get_conversation(
        db,
        conversation_id,
    )


def get_conversations(
    db: Session,
    skip: int,
    limit: int,
):
    return conversation_repository.get_conversations(
        db,
        skip,
        limit,
    )


def search_conversations(
    db: Session,
    keyword: str,
):
    return conversation_repository.search_conversations(
        db,
        keyword,
    )


def update_conversation(
    db: Session,
    conversation_id: int,
    conversation: ConversationUpdate,
):
    return conversation_repository.update_conversation(
        db,
        conversation_id,
        conversation,
    )


def delete_conversation(
    db: Session,
    conversation_id: int,
):
    return conversation_repository.delete_conversation(
        db,
        conversation_id,
    )
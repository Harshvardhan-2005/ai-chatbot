from sqlalchemy.orm import Session

import app.repositories.conversation_repository as conversation_repository

from app.schemas.conversation import (
    ConversationCreate,
    ConversationUpdate,
)


def create_conversation(
    db: Session,
    conversation: ConversationCreate,
    owner_id: int,
):
    return conversation_repository.create_conversation(
        db,
        conversation,
        owner_id,
    )


def get_conversation(
    db: Session,
    conversation_id: int,
    owner_id: int,
):
    return conversation_repository.get_conversation(
        db,
        conversation_id,
        owner_id,
    )


def get_conversations(
    db: Session,
    owner_id: int,
    skip: int,
    limit: int,
):
    return conversation_repository.get_conversations(
        db,
        owner_id,
        skip,
        limit,
    )


def search_conversations(
    db: Session,
    owner_id: int,
    keyword: str,
):
    return conversation_repository.search_conversations(
        db,
        owner_id,
        keyword,
    )


def update_conversation(
    db: Session,
    conversation_id: int,
    conversation: ConversationUpdate,
    owner_id: int,
):
    return conversation_repository.update_conversation(
        db,
        conversation_id,
        conversation,
        owner_id,
    )


def delete_conversation(
    db: Session,
    conversation_id: int,
    owner_id: int,
):
    return conversation_repository.delete_conversation(
        db,
        conversation_id,
        owner_id,
    )
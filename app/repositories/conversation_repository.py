from sqlalchemy.orm import Session

from app.models.conversation import Conversation
from app.schemas.conversation import (
    ConversationCreate,
    ConversationUpdate,
)


def create_conversation(
    db: Session,
    conversation: ConversationCreate,
):
    db_conversation = Conversation(
        **conversation.model_dump()
    )

    db.add(db_conversation)
    db.commit()
    db.refresh(db_conversation)

    return db_conversation


def get_conversation(
    db: Session,
    conversation_id: int,
):
    return (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id)
        .first()
    )


def get_conversations(
    db: Session,
    skip: int,
    limit: int,
):
    return (
        db.query(Conversation)
        .offset(skip)
        .limit(limit)
        .all()
    )


def search_conversations(
    db: Session,
    keyword: str,
):
    return (
        db.query(Conversation)
        .filter(
            Conversation.title.ilike(f"%{keyword}%")
        )
        .all()
    )


def update_conversation(
    db: Session,
    conversation_id: int,
    conversation: ConversationUpdate,
):
    db_conversation = get_conversation(
        db,
        conversation_id,
    )

    if not db_conversation:
        return None

    update_data = conversation.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            db_conversation,
            key,
            value,
        )

    db.commit()
    db.refresh(db_conversation)

    return db_conversation


def delete_conversation(
    db: Session,
    conversation_id: int,
):
    db_conversation = get_conversation(
        db,
        conversation_id,
    )

    if not db_conversation:
        return False

    db.delete(db_conversation)
    db.commit()

    return True
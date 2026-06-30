from sqlalchemy.orm import Session

from app.models.chatbot import Chatbot
from app.models.conversation import Conversation
from app.schemas.conversation import (
    ConversationCreate,
    ConversationUpdate,
)


def create_conversation(
    db: Session,
    conversation: ConversationCreate,
    owner_id: int,
):
    chatbot = (
        db.query(Chatbot)
        .filter(
            Chatbot.id == conversation.chatbot_id,
            Chatbot.owner_id == owner_id,
        )
        .first()
    )

    if not chatbot:
        return None

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
    owner_id: int,
):
    return (
        db.query(Conversation)
        .join(Chatbot)
        .filter(
            Conversation.id == conversation_id,
            Chatbot.owner_id == owner_id,
        )
        .first()
    )


def get_conversations(
    db: Session,
    owner_id: int,
    skip: int,
    limit: int,
):
    return (
        db.query(Conversation)
        .join(Chatbot)
        .filter(Chatbot.owner_id == owner_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


def search_conversations(
    db: Session,
    owner_id: int,
    keyword: str,
):
    return (
        db.query(Conversation)
        .join(Chatbot)
        .filter(
            Chatbot.owner_id == owner_id,
            Conversation.title.ilike(f"%{keyword}%"),
        )
        .all()
    )


def update_conversation(
    db: Session,
    conversation_id: int,
    conversation: ConversationUpdate,
    owner_id: int,
):
    db_conversation = get_conversation(
        db,
        conversation_id,
        owner_id,
    )

    if not db_conversation:
        return None

    update_data = conversation.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(db_conversation, key, value)

    db.commit()
    db.refresh(db_conversation)

    return db_conversation


def delete_conversation(
    db: Session,
    conversation_id: int,
    owner_id: int,
):
    db_conversation = get_conversation(
        db,
        conversation_id,
        owner_id,
    )

    if not db_conversation:
        return False

    db.delete(db_conversation)
    db.commit()

    return True
from sqlalchemy.orm import Session

from app.models.chatbot import Chatbot
from app.models.conversation import Conversation
from app.models.message import Message
from app.schemas.message import (
    MessageCreate,
    MessageUpdate,
)


def create_message(
    db: Session,
    message: MessageCreate,
    owner_id: int,
):
    conversation = (
        db.query(Conversation)
        .join(
            Chatbot,
            Conversation.chatbot_id == Chatbot.id,
        )
        .filter(
            Conversation.id == message.conversation_id,
            Chatbot.owner_id == owner_id,
        )
        .first()
    )

    if not conversation:
        return None

    db_message = Message(
        **message.model_dump()
    )

    db.add(db_message)
    db.commit()
    db.refresh(db_message)

    return db_message


def get_message(
    db: Session,
    message_id: int,
    owner_id: int,
):
    return (
        db.query(Message)
        .join(
            Conversation,
            Message.conversation_id == Conversation.id,
        )
        .join(
            Chatbot,
            Conversation.chatbot_id == Chatbot.id,
        )
        .filter(
            Message.id == message_id,
            Chatbot.owner_id == owner_id,
        )
        .first()
    )


def get_messages(
    db: Session,
    owner_id: int,
    skip: int,
    limit: int,
):
    return (
        db.query(Message)
        .join(
            Conversation,
            Message.conversation_id == Conversation.id,
        )
        .join(
            Chatbot,
            Conversation.chatbot_id == Chatbot.id,
        )
        .filter(
            Chatbot.owner_id == owner_id,
        )
        .order_by(Message.created_at)
        .offset(skip)
        .limit(limit)
        .all()
    )


def search_messages(
    db: Session,
    owner_id: int,
    keyword: str,
):
    return (
        db.query(Message)
        .join(
            Conversation,
            Message.conversation_id == Conversation.id,
        )
        .join(
            Chatbot,
            Conversation.chatbot_id == Chatbot.id,
        )
        .filter(
            Chatbot.owner_id == owner_id,
            Message.content.ilike(f"%{keyword}%"),
        )
        .order_by(Message.created_at)
        .all()
    )


def update_message(
    db: Session,
    message_id: int,
    message: MessageUpdate,
    owner_id: int,
):
    db_message = get_message(
        db,
        message_id,
        owner_id,
    )

    if not db_message:
        return None

    update_data = message.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            db_message,
            key,
            value,
        )

    db.commit()
    db.refresh(db_message)

    return db_message


def delete_message(
    db: Session,
    message_id: int,
    owner_id: int,
):
    db_message = get_message(
        db,
        message_id,
        owner_id,
    )

    if not db_message:
        return False

    db.delete(db_message)
    db.commit()

    return True

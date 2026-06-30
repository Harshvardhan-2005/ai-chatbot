from sqlalchemy.orm import Session

from app.models.conversation import Conversation
from app.models.message import Message
from app.schemas.message import (
    MessageCreate,
    MessageUpdate,
)


def create_message(
    db: Session,
    message: MessageCreate,
):
    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == message.conversation_id,
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
):
    return (
        db.query(Message)
        .filter(Message.id == message_id)
        .first()
    )


def get_messages(
    db: Session,
    skip: int,
    limit: int,
):
    return (
        db.query(Message)
        .offset(skip)
        .limit(limit)
        .all()
    )


def search_messages(
    db: Session,
    keyword: str,
):
    return (
        db.query(Message)
        .filter(
            Message.content.ilike(f"%{keyword}%")
        )
        .all()
    )


def update_message(
    db: Session,
    message_id: int,
    message: MessageUpdate,
):
    db_message = get_message(
        db,
        message_id,
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
):
    db_message = get_message(
        db,
        message_id,
    )

    if not db_message:
        return False

    db.delete(db_message)
    db.commit()

    return True
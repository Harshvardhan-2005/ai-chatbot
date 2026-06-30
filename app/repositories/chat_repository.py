from sqlalchemy.orm import Session

from app.models.conversation import Conversation
from app.models.message import Message


def get_conversation(
    db: Session,
    conversation_id: int,
):
    return (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id
        )
        .first()
    )


def create_message(
    db: Session,
    conversation_id: int,
    role: str,
    content: str,
):
    db_message = Message(
        conversation_id=conversation_id,
        role=role,
        content=content,
    )

    db.add(db_message)
    db.commit()
    db.refresh(db_message)

    return db_message
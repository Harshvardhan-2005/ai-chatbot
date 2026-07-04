from sqlalchemy.orm import Session
from app.models.chatbot import Chatbot
from app.models.conversation import Conversation
from app.models.message import Message


def get_conversation(
    db: Session,
    conversation_id: int,
    owner_id: int,
):
    return (
        db.query(Conversation)
        .join(
            Chatbot,
            Conversation.chatbot_id == Chatbot.id,
        )
        .filter(
            Conversation.id == conversation_id,
            Chatbot.owner_id == owner_id,
        )
        .first()
    )


def get_history(
    db: Session,
    conversation_id: int,
):
    return (
        db.query(Message)
        .filter(
            Message.conversation_id == conversation_id
        )
        .order_by(Message.created_at)
        .all()
    )


def update_title(
    conversation: Conversation,
    title: str,
):
    conversation.title = title


def save_messages(
    db: Session,
    conversation: Conversation,
    user_message: str,
    assistant_message: str,
):
    user = Message(
        conversation_id=conversation.id,
        role="user",
        content=user_message,
    )

    assistant = Message(
        conversation_id=conversation.id,
        role="assistant",
        content=assistant_message,
    )

    db.add(user)
    db.add(assistant)

    db.commit()

    db.refresh(user)
    db.refresh(assistant)
    db.refresh(conversation)

    return user, assistant

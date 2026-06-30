import logging

from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.conversation import Conversation
from app.models.message import Message

from app.schemas.chat import ChatRequest, ChatResponse

from app.services.llm_service import (
    generate_response,
    generate_title,
)

logger = logging.getLogger(__name__)


def chat_with_ai(
    db: Session,
    chat_request: ChatRequest,
) -> ChatResponse:
    logger.info(
        "Processing chat request for conversation %s",
        chat_request.conversation_id,
    )

    # Check if conversation exists
    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == chat_request.conversation_id
        )
        .first()
    )

    if not conversation:
        logger.warning(
            "Conversation %s not found.",
            chat_request.conversation_id,
        )
        raise HTTPException(
            status_code=404,
            detail="Conversation not found.",
        )

    # Load previous conversation history
    history = (
        db.query(Message)
        .filter(
            Message.conversation_id == chat_request.conversation_id
        )
        .order_by(Message.created_at)
        .all()
    )

    logger.info(
        "Loaded %d previous messages.",
        len(history),
    )

    messages = []

    for msg in history:
        messages.append(
            {
                "role": msg.role,
                "content": msg.content,
            }
        )

    # Generate title only for the first message
    if len(history) == 0:
        conversation.title = generate_title(
            chat_request.message
        )

        logger.info(
            "Generated conversation title: %s",
            conversation.title,
        )

    # Add current user message
    messages.append(
        {
            "role": "user",
            "content": chat_request.message,
        }
    )

    # Generate AI response
    ai_response = generate_response(messages)

    logger.info("LLM response generated successfully.")

    try:
        # Save user message
        user_message = Message(
            conversation_id=chat_request.conversation_id,
            role="user",
            content=chat_request.message,
        )

        db.add(user_message)

        # Save assistant message
        assistant_message = Message(
            conversation_id=chat_request.conversation_id,
            role="assistant",
            content=ai_response,
        )

        db.add(assistant_message)

        db.commit()

        db.refresh(user_message)
        db.refresh(assistant_message)
        db.refresh(conversation)

        logger.info(
            "Successfully saved chat for conversation %s",
            chat_request.conversation_id,
        )

    except SQLAlchemyError:
        logger.exception(
            "Database error while saving chat."
        )
        db.rollback()
        raise

    return ChatResponse(
        conversation_id=chat_request.conversation_id,
        user_message=chat_request.message,
        assistant_message=ai_response,
    )
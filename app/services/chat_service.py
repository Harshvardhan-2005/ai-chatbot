import logging

from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.repositories import chat_repository
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.llm_service import (
    generate_response,
    generate_title,
)

logger = logging.getLogger(__name__)


def chat_with_ai(
    db: Session,
    chat_request: ChatRequest,
    owner_id: int,
) -> ChatResponse:
    logger.info(
        "Processing chat request for conversation %s",
        chat_request.conversation_id,
    )

    # Check if conversation exists
    conversation = chat_repository.get_conversation(
        db,
        chat_request.conversation_id,
        owner_id,
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
    history = chat_repository.get_history(
        db,
        chat_request.conversation_id,
    )

    logger.info(
        "Loaded %d previous messages.",
        len(history),
    )

    knowledge_bases = chat_repository.get_chatbot_knowledge(
        db,
        conversation.chatbot_id,
    )

    messages = []

    if knowledge_bases:
        knowledge_context = "\n\n".join(
            (
                f"Title: {knowledge.title}\n"
                f"Content: {knowledge.content}"
            )
            for knowledge in knowledge_bases
        )

        messages.append(
            {
                "role": "system",
                "content": (
                    "Use the following chatbot knowledge base "
                    "to help answer the user's questions.\n\n"
                    f"{knowledge_context}"
                ),
            }
        )

    for msg in history:
        messages.append(
            {
                "role": msg.role,
                "content": msg.content,
            }
        )

    # Generate title only for the first message
    if len(history) == 0:
        chat_repository.update_title(
            conversation,
            generate_title(chat_request.message),
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

    logger.info(
        "LLM response generated successfully."
    )

    try:
        chat_repository.save_messages(
            db=db,
            conversation=conversation,
            user_message=chat_request.message,
            assistant_message=ai_response,
        )

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

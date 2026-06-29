from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.conversation import (
    ConversationCreate,
    ConversationUpdate,
    ConversationResponse,
)

from app.services.conversation_service import (
    create_conversation,
    get_conversation,
    get_conversations,
    search_conversations,
    update_conversation,
    delete_conversation,
)

router = APIRouter(
    prefix="/conversations",
    tags=["Conversations"],
)


@router.post(
    "",
    response_model=ConversationResponse,
    status_code=201,
)
def create_conversation_api(
    conversation: ConversationCreate,
    db: Session = Depends(get_db),
):
    return create_conversation(
        db,
        conversation,
    )


@router.get(
    "",
    response_model=list[ConversationResponse],
)
def get_conversations_api(
    page: int = 1,
    size: int = 10,
    db: Session = Depends(get_db),
):
    skip = (page - 1) * size

    return get_conversations(
        db,
        skip,
        size,
    )


@router.get("/search")
def search_conversations_api(
    keyword: str,
    db: Session = Depends(get_db),
):
    return search_conversations(
        db,
        keyword,
    )


@router.get(
    "/{conversation_id}",
    response_model=ConversationResponse,
)
def get_conversation_api(
    conversation_id: int,
    db: Session = Depends(get_db),
):
    conversation = get_conversation(
        db,
        conversation_id,
    )

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    return conversation


@router.put(
    "/{conversation_id}",
    response_model=ConversationResponse,
)
def update_conversation_api(
    conversation_id: int,
    conversation: ConversationUpdate,
    db: Session = Depends(get_db),
):
    updated = update_conversation(
        db,
        conversation_id,
        conversation,
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    return updated


@router.delete(
    "/{conversation_id}",
)
def delete_conversation_api(
    conversation_id: int,
    db: Session = Depends(get_db),
):
    success = delete_conversation(
        db,
        conversation_id,
    )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    return {
        "message": "Conversation deleted successfully"
    }
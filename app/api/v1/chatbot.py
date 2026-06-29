from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.chatbot import (
    ChatbotCreate,
    ChatbotResponse,
    ChatbotUpdate,
)
from app.services.chatbot_service import (
    create_chatbot,
    get_chatbot,
    get_chatbots,
    search_chatbots,
    update_chatbot,
    delete_chatbot,
)

router = APIRouter(
    prefix="/chatbots",
    tags=["Chatbots"],
)


@router.post(
    "",
    response_model=ChatbotResponse,
    status_code=201,
)
def create_chatbot_api(
    chatbot: ChatbotCreate,
    db: Session = Depends(get_db),
):
    return create_chatbot(db, chatbot)


@router.get(
    "",
    response_model=list[ChatbotResponse],
)
def get_chatbots_api(
    page: int = 1,
    size: int = 10,
    db: Session = Depends(get_db),
):
    skip = (page - 1) * size
    return get_chatbots(db, skip, size)


@router.get("/search")
def search_chatbots_api(
    keyword: str,
    db: Session = Depends(get_db),
):
    return search_chatbots(db, keyword)


@router.get(
    "/{chatbot_id}",
    response_model=ChatbotResponse,
)
def get_chatbot_api(
    chatbot_id: int,
    db: Session = Depends(get_db),
):
    chatbot = get_chatbot(db, chatbot_id)

    if not chatbot:
        raise HTTPException(
            status_code=404,
            detail="Chatbot not found",
        )

    return chatbot


@router.put(
    "/{chatbot_id}",
    response_model=ChatbotResponse,
)
def update_chatbot_api(
    chatbot_id: int,
    chatbot: ChatbotUpdate,
    db: Session = Depends(get_db),
):
    updated = update_chatbot(
        db,
        chatbot_id,
        chatbot,
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Chatbot not found",
        )

    return updated


@router.delete("/{chatbot_id}")
def delete_chatbot_api(
    chatbot_id: int,
    db: Session = Depends(get_db),
):
    success = delete_chatbot(db, chatbot_id)

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Chatbot not found",
        )

    return {
        "message": "Chatbot deleted successfully"
    }
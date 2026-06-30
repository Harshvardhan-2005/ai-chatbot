from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.chat import ChatRequest
from app.schemas.chat import ChatResponse

from app.services.chat_service import chat_with_ai

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post(
    "",
    response_model=ChatResponse,
)
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
):
    return chat_with_ai(
        db,
        request,
    )
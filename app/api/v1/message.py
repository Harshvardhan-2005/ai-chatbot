from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.message import (
    MessageCreate,
    MessageUpdate,
    MessageResponse,
)

from app.services.message_service import (
    create_message,
    get_message,
    get_messages,
    search_messages,
    update_message,
    delete_message,
)

router = APIRouter(
    prefix="/messages",
    tags=["Messages"],
)


@router.post(
    "",
    response_model=MessageResponse,
    status_code=201,
)
def create_message_api(
    message: MessageCreate,
    db: Session = Depends(get_db),
):
    created = create_message(
        db,
        message,
    )

    if not created:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    return created


@router.get(
    "",
    response_model=list[MessageResponse],
)
def get_messages_api(
    page: int = 1,
    size: int = 10,
    db: Session = Depends(get_db),
):
    skip = (page - 1) * size

    return get_messages(
        db,
        skip,
        size,
    )


@router.get("/search")
def search_messages_api(
    keyword: str,
    db: Session = Depends(get_db),
):
    return search_messages(
        db,
        keyword,
    )


@router.get(
    "/{message_id}",
    response_model=MessageResponse,
)
def get_message_api(
    message_id: int,
    db: Session = Depends(get_db),
):
    message = get_message(
        db,
        message_id,
    )

    if not message:
        raise HTTPException(
            status_code=404,
            detail="Message not found",
        )

    return message


@router.put(
    "/{message_id}",
    response_model=MessageResponse,
)
def update_message_api(
    message_id: int,
    message: MessageUpdate,
    db: Session = Depends(get_db),
):
    updated = update_message(
        db,
        message_id,
        message,
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Message not found",
        )

    return updated


@router.delete(
    "/{message_id}",
)
def delete_message_api(
    message_id: int,
    db: Session = Depends(get_db),
):
    success = delete_message(
        db,
        message_id,
    )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Message not found",
        )

    return {
        "message": "Message deleted successfully"
    }
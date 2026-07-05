from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.session import get_db
from app.models.user import User

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
    current_user: User = Depends(get_current_user),
):
    created = create_message(
        db,
        message,
        current_user.id,
    )

    if not created:
        raise HTTPException(
            status_code=404,
            detail=(
                "Conversation not found or "
                "does not belong to you"
            ),
        )

    return created


@router.get(
    "",
    response_model=list[MessageResponse],
)
def get_messages_api(
    page: int = Query(
        default=1,
        ge=1,
    ),
    size: int = Query(
        default=10,
        ge=1,
        le=100,
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    skip = (page - 1) * size

    return get_messages(
        db,
        current_user.id,
        skip,
        size,
    )


@router.get(
    "/search",
    response_model=list[MessageResponse],
)
def search_messages_api(
    keyword: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return search_messages(
        db,
        current_user.id,
        keyword,
    )


@router.get(
    "/{message_id}",
    response_model=MessageResponse,
)
def get_message_api(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    message = get_message(
        db,
        message_id,
        current_user.id,
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
    current_user: User = Depends(get_current_user),
):
    updated = update_message(
        db,
        message_id,
        message,
        current_user.id,
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
    current_user: User = Depends(get_current_user),
):
    success = delete_message(
        db,
        message_id,
        current_user.id,
    )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Message not found",
        )

    return {
        "message": "Message deleted successfully"
    }

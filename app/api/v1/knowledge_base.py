from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.session import get_db
from app.models.user import User

from app.schemas.knowledge_base import (
    KnowledgeBaseCreate,
    KnowledgeBaseResponse,
    KnowledgeBaseUpdate,
)

from app.services.knowledge_base_service import (
    create_knowledge_base,
    get_knowledge_base,
    get_knowledge_bases,
    search_knowledge_bases,
    update_knowledge_base,
    delete_knowledge_base,
)

router = APIRouter(
    prefix="/knowledge-bases",
    tags=["Knowledge Bases"],
)


@router.post(
    "",
    response_model=KnowledgeBaseResponse,
    status_code=201,
)
def create_knowledge_base_api(
    knowledge_base: KnowledgeBaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    created = create_knowledge_base(
        db,
        knowledge_base,
        current_user.id,
    )

    if not created:
        raise HTTPException(
            status_code=404,
            detail="Chatbot not found or does not belong to you",
        )

    return created


@router.get(
    "",
    response_model=list[KnowledgeBaseResponse],
)
def get_knowledge_bases_api(
    page: int = 1,
    size: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    skip = (page - 1) * size

    return get_knowledge_bases(
        db,
        current_user.id,
        skip,
        size,
    )


@router.get("/search")
def search_knowledge_bases_api(
    keyword: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return search_knowledge_bases(
        db,
        current_user.id,
        keyword,
    )


@router.get(
    "/{knowledge_base_id}",
    response_model=KnowledgeBaseResponse,
)
def get_knowledge_base_api(
    knowledge_base_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    knowledge_base = get_knowledge_base(
        db,
        knowledge_base_id,
        current_user.id,
    )

    if not knowledge_base:
        raise HTTPException(
            status_code=404,
            detail="Knowledge Base not found",
        )

    return knowledge_base


@router.put(
    "/{knowledge_base_id}",
    response_model=KnowledgeBaseResponse,
)
def update_knowledge_base_api(
    knowledge_base_id: int,
    knowledge_base: KnowledgeBaseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updated = update_knowledge_base(
        db,
        knowledge_base_id,
        knowledge_base,
        current_user.id,
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Knowledge Base not found",
        )

    return updated


@router.delete("/{knowledge_base_id}")
def delete_knowledge_base_api(
    knowledge_base_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    success = delete_knowledge_base(
        db,
        knowledge_base_id,
        current_user.id,
    )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Knowledge Base not found",
        )

    return {
        "message": "Knowledge Base deleted successfully"
    }
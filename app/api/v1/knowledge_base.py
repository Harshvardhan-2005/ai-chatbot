from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
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
):
    return create_knowledge_base(db, knowledge_base)


@router.get(
    "",
    response_model=list[KnowledgeBaseResponse],
)
def get_knowledge_bases_api(
    page: int = 1,
    size: int = 10,
    db: Session = Depends(get_db),
):
    skip = (page - 1) * size
    return get_knowledge_bases(db, skip, size)


@router.get("/search")
def search_knowledge_bases_api(
    keyword: str,
    db: Session = Depends(get_db),
):
    return search_knowledge_bases(db, keyword)


@router.get(
    "/{kb_id}",
    response_model=KnowledgeBaseResponse,
)
def get_knowledge_base_api(
    kb_id: int,
    db: Session = Depends(get_db),
):
    kb = get_knowledge_base(db, kb_id)

    if not kb:
        raise HTTPException(
            status_code=404,
            detail="Knowledge base not found",
        )

    return kb


@router.put(
    "/{kb_id}",
    response_model=KnowledgeBaseResponse,
)
def update_knowledge_base_api(
    kb_id: int,
    knowledge_base: KnowledgeBaseUpdate,
    db: Session = Depends(get_db),
):
    updated = update_knowledge_base(
        db,
        kb_id,
        knowledge_base,
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Knowledge base not found",
        )

    return updated


@router.delete("/{kb_id}")
def delete_knowledge_base_api(
    kb_id: int,
    db: Session = Depends(get_db),
):
    success = delete_knowledge_base(db, kb_id)

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Knowledge base not found",
        )

    return {
        "message": "Knowledge base deleted successfully"
    }
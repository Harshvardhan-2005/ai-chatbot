from sqlalchemy.orm import Session

import app.repositories.knowledge_base_repository as knowledge_base_repository

from app.schemas.knowledge_base import (
    KnowledgeBaseCreate,
    KnowledgeBaseUpdate,
)


def create_knowledge_base(
    db: Session,
    knowledge_base: KnowledgeBaseCreate,
):
    return knowledge_base_repository.create_knowledge_base(
        db,
        knowledge_base,
    )


def get_knowledge_base(
    db: Session,
    kb_id: int,
):
    return knowledge_base_repository.get_knowledge_base(
        db,
        kb_id,
    )


def get_knowledge_bases(
    db: Session,
    skip: int,
    limit: int,
):
    return knowledge_base_repository.get_knowledge_bases(
        db,
        skip,
        limit,
    )


def search_knowledge_bases(
    db: Session,
    keyword: str,
):
    return knowledge_base_repository.search_knowledge_bases(
        db,
        keyword,
    )


def update_knowledge_base(
    db: Session,
    kb_id: int,
    knowledge_base: KnowledgeBaseUpdate,
):
    return knowledge_base_repository.update_knowledge_base(
        db,
        kb_id,
        knowledge_base,
    )


def delete_knowledge_base(
    db: Session,
    kb_id: int,
):
    return knowledge_base_repository.delete_knowledge_base(
        db,
        kb_id,
    )
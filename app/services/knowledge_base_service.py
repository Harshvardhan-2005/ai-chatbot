from sqlalchemy.orm import Session

import app.repositories.knowledge_base_repository as knowledge_base_repository
from app.schemas.knowledge_base import (
    KnowledgeBaseCreate,
    KnowledgeBaseUpdate,
)


def create_knowledge_base(
    db: Session,
    knowledge_base: KnowledgeBaseCreate,
    owner_id: int,
):
    return knowledge_base_repository.create_knowledge_base(
        db,
        knowledge_base,
        owner_id,
    )


def get_knowledge_base(
    db: Session,
    knowledge_base_id: int,
    owner_id: int,
):
    return knowledge_base_repository.get_knowledge_base(
        db,
        knowledge_base_id,
        owner_id,
    )


def get_knowledge_bases(
    db: Session,
    owner_id: int,
    skip: int,
    limit: int,
):
    return knowledge_base_repository.get_knowledge_bases(
        db,
        owner_id,
        skip,
        limit,
    )


def search_knowledge_bases(
    db: Session,
    owner_id: int,
    keyword: str,
):
    return knowledge_base_repository.search_knowledge_bases(
        db,
        owner_id,
        keyword,
    )


def update_knowledge_base(
    db: Session,
    knowledge_base_id: int,
    knowledge_base: KnowledgeBaseUpdate,
    owner_id: int,
):
    return knowledge_base_repository.update_knowledge_base(
        db,
        knowledge_base_id,
        knowledge_base,
        owner_id,
    )


def delete_knowledge_base(
    db: Session,
    knowledge_base_id: int,
    owner_id: int,
):
    return knowledge_base_repository.delete_knowledge_base(
        db,
        knowledge_base_id,
        owner_id,
    )
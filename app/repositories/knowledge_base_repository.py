from sqlalchemy.orm import Session

from app.models.knowledge_base import KnowledgeBase
from app.schemas.knowledge_base import (
    KnowledgeBaseCreate,
    KnowledgeBaseUpdate,
)


def create_knowledge_base(
    db: Session,
    knowledge_base: KnowledgeBaseCreate,
):
    db_kb = KnowledgeBase(
        **knowledge_base.model_dump()
    )

    db.add(db_kb)
    db.commit()
    db.refresh(db_kb)

    return db_kb


def get_knowledge_base(
    db: Session,
    kb_id: int,
):
    return (
        db.query(KnowledgeBase)
        .filter(KnowledgeBase.id == kb_id)
        .first()
    )


def get_knowledge_bases(
    db: Session,
    skip: int,
    limit: int,
):
    return (
        db.query(KnowledgeBase)
        .offset(skip)
        .limit(limit)
        .all()
    )


def search_knowledge_bases(
    db: Session,
    keyword: str,
):
    return (
        db.query(KnowledgeBase)
        .filter(
            KnowledgeBase.title.ilike(
                f"%{keyword}%"
            )
        )
        .all()
    )


def update_knowledge_base(
    db: Session,
    kb_id: int,
    knowledge_base: KnowledgeBaseUpdate,
):
    db_kb = get_knowledge_base(
        db,
        kb_id,
    )

    if not db_kb:
        return None

    update_data = knowledge_base.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            db_kb,
            key,
            value,
        )

    db.commit()
    db.refresh(db_kb)

    return db_kb


def delete_knowledge_base(
    db: Session,
    kb_id: int,
):
    db_kb = get_knowledge_base(
        db,
        kb_id,
    )

    if not db_kb:
        return False

    db.delete(db_kb)
    db.commit()

    return True
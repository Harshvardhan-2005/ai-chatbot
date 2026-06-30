from sqlalchemy.orm import Session

from app.models.chatbot import Chatbot
from app.models.knowledge_base import KnowledgeBase
from app.schemas.knowledge_base import (
    KnowledgeBaseCreate,
    KnowledgeBaseUpdate,
)


def create_knowledge_base(
    db: Session,
    knowledge_base: KnowledgeBaseCreate,
    owner_id: int,
):
    chatbot = (
        db.query(Chatbot)
        .filter(
            Chatbot.id == knowledge_base.chatbot_id,
            Chatbot.owner_id == owner_id,
        )
        .first()
    )

    if not chatbot:
        return None

    db_knowledge_base = KnowledgeBase(
        **knowledge_base.model_dump()
    )

    db.add(db_knowledge_base)
    db.commit()
    db.refresh(db_knowledge_base)

    return db_knowledge_base


def get_knowledge_base(
    db: Session,
    knowledge_base_id: int,
    owner_id: int,
):
    return (
        db.query(KnowledgeBase)
        .join(Chatbot)
        .filter(
            KnowledgeBase.id == knowledge_base_id,
            Chatbot.owner_id == owner_id,
        )
        .first()
    )


def get_knowledge_bases(
    db: Session,
    owner_id: int,
    skip: int,
    limit: int,
):
    return (
        db.query(KnowledgeBase)
        .join(Chatbot)
        .filter(Chatbot.owner_id == owner_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


def search_knowledge_bases(
    db: Session,
    owner_id: int,
    keyword: str,
):
    return (
        db.query(KnowledgeBase)
        .join(Chatbot)
        .filter(
            Chatbot.owner_id == owner_id,
            KnowledgeBase.title.ilike(f"%{keyword}%"),
        )
        .all()
    )


def update_knowledge_base(
    db: Session,
    knowledge_base_id: int,
    knowledge_base: KnowledgeBaseUpdate,
    owner_id: int,
):
    db_knowledge_base = get_knowledge_base(
        db,
        knowledge_base_id,
        owner_id,
    )

    if not db_knowledge_base:
        return None

    update_data = knowledge_base.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(db_knowledge_base, key, value)

    db.commit()
    db.refresh(db_knowledge_base)

    return db_knowledge_base


def delete_knowledge_base(
    db: Session,
    knowledge_base_id: int,
    owner_id: int,
):
    db_knowledge_base = get_knowledge_base(
        db,
        knowledge_base_id,
        owner_id,
    )

    if not db_knowledge_base:
        return False

    db.delete(db_knowledge_base)
    db.commit()

    return True
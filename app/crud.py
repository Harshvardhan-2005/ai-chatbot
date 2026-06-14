from sqlalchemy.orm import Session

from app.models import Chatbot, KnowledgeBase
from app.schemas import (
    ChatbotCreate,
    ChatbotUpdate,
    KnowledgeBaseCreate,
    KnowledgeBaseUpdate
)


def create_chatbot(
    db: Session,
    chatbot: ChatbotCreate
):
    db_chatbot = Chatbot(**chatbot.model_dump())

    db.add(db_chatbot)
    db.commit()
    db.refresh(db_chatbot)

    return db_chatbot


def get_chatbot(
    db: Session,
    chatbot_id: int
):
    return (
        db.query(Chatbot)
        .filter(Chatbot.id == chatbot_id)
        .first()
    )


def get_chatbots(
    db: Session,
    skip: int,
    limit: int
):
    return (
        db.query(Chatbot)
        .offset(skip)
        .limit(limit)
        .all()
    )


def search_chatbots(
    db: Session,
    keyword: str
):
    return (
        db.query(Chatbot)
        .filter(
            Chatbot.name.ilike(f"%{keyword}%")
        )
        .all()
    )


def update_chatbot(
    db: Session,
    chatbot_id: int,
    chatbot: ChatbotUpdate
):
    db_chatbot = get_chatbot(
        db,
        chatbot_id
    )

    if not db_chatbot:
        return None

    update_data = chatbot.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            db_chatbot,
            key,
            value
        )

    db.commit()
    db.refresh(db_chatbot)

    return db_chatbot


def delete_chatbot(
    db: Session,
    chatbot_id: int
):
    db_chatbot = get_chatbot(
        db,
        chatbot_id
    )

    if not db_chatbot:
        return False

    db.delete(db_chatbot)
    db.commit()

    return True


def create_knowledge_base(
    db: Session,
    knowledge_base: KnowledgeBaseCreate
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
    kb_id: int
):
    return (
        db.query(KnowledgeBase)
        .filter(KnowledgeBase.id == kb_id)
        .first()
    )


def get_knowledge_bases(
    db: Session,
    skip: int,
    limit: int
):
    return (
        db.query(KnowledgeBase)
        .offset(skip)
        .limit(limit)
        .all()
    )


def search_knowledge_bases(
    db: Session,
    keyword: str
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
    knowledge_base: KnowledgeBaseUpdate
):
    db_kb = get_knowledge_base(
        db,
        kb_id
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
            value
        )

    db.commit()
    db.refresh(db_kb)

    return db_kb


def delete_knowledge_base(
    db: Session,
    kb_id: int
):
    db_kb = get_knowledge_base(
        db,
        kb_id
    )

    if not db_kb:
        return False

    db.delete(db_kb)
    db.commit()

    return True
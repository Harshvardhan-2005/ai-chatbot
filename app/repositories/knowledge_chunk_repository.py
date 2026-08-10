from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.knowledge_chunk import KnowledgeChunk


def search_similar_chunks(
    db: Session,
    embedding: list[float],
    limit: int = 5,
):
    statement = (
        select(KnowledgeChunk)
        .where(KnowledgeChunk.embedding.is_not(None))
        .order_by(
            KnowledgeChunk.embedding.cosine_distance(embedding)
        )
        .limit(limit)
    )

    return db.scalars(statement).all()
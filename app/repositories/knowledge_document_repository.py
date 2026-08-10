from sqlalchemy.orm import Session

from app.models.knowledge_base import KnowledgeBase
from app.models.knowledge_document import KnowledgeDocument
from app.models.knowledge_chunk import KnowledgeChunk


def get_knowledge_base_for_owner(
    db: Session,
    knowledge_base_id: int,
    owner_id: int,
):
    return (
        db.query(KnowledgeBase)
        .join(KnowledgeBase.chatbot)
        .filter(
            KnowledgeBase.id == knowledge_base_id,
            KnowledgeBase.chatbot.has(
                owner_id=owner_id,
            ),
        )
        .first()
    )


def create_document(
    db: Session,
    knowledge_base_id: int,
    filename: str,
    file_type: str,
):
    document = KnowledgeDocument(
        knowledge_base_id=knowledge_base_id,
        filename=filename,
        file_type=file_type,
    )

    db.add(document)
    db.flush()

    return document


def create_chunks(
    db: Session,
    document_id: int,
    chunks: list[str],
    embeddings: list[list[float]],
):
    if len(chunks) != len(embeddings):
        raise ValueError(
            "Number of chunks must match number of embeddings."
        )

    db_chunks = []

    for index, (content, embedding) in enumerate(
        zip(chunks, embeddings)
    ):
        chunk = KnowledgeChunk(
            document_id=document_id,
            chunk_index=index,
            content=content,
            embedding=embedding,
        )

        db.add(chunk)
        db_chunks.append(chunk)

    return db_chunks


def commit_document(
    db: Session,
):
    db.commit()

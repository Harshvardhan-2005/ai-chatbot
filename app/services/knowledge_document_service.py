from sqlalchemy.orm import Session

from app.repositories import knowledge_document_repository
from app.services.chunking_service import chunk_text
from app.services.embedding_service import generate_embedding
from app.services.text_extraction_service import extract_text_from_pdf


def ingest_pdf(
    db: Session,
    knowledge_base_id: int,
    owner_id: int,
    filename: str,
    file_bytes: bytes,
):
    knowledge_base = (
        knowledge_document_repository
        .get_knowledge_base_for_owner(
            db,
            knowledge_base_id,
            owner_id,
        )
    )

    if not knowledge_base:
        return None

    text = extract_text_from_pdf(file_bytes)

    if not text:
        raise ValueError(
            "No extractable text found in the PDF."
        )

    chunks = chunk_text(text)

    if not chunks:
        raise ValueError(
            "Unable to create chunks from the PDF."
        )

    document = (
        knowledge_document_repository
        .create_document(
            db,
            knowledge_base_id,
            filename,
            "pdf",
        )
    )

    embeddings = [
        generate_embedding(chunk)
        for chunk in chunks
    ]

    db_chunks = (
        knowledge_document_repository
        .create_chunks(
            db,
            document.id,
            chunks,
            embeddings,
        )
    )

    knowledge_document_repository.commit_document(db)

    return document, len(db_chunks)

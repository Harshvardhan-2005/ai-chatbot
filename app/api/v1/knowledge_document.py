from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
)
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.knowledge_document import (
    KnowledgeDocumentResponse,
)
from app.services.knowledge_document_service import (
    ingest_pdf,
)


router = APIRouter(
    prefix="/knowledge-bases",
    tags=["Knowledge Documents"],
)


@router.post(
    "/{knowledge_base_id}/documents",
    response_model=KnowledgeDocumentResponse,
    status_code=201,
)
def upload_document(
    knowledge_base_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported.",
        )

    file_bytes = file.file.read()

    if not file_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty.",
        )

    try:
        result = ingest_pdf(
            db=db,
            knowledge_base_id=knowledge_base_id,
            owner_id=current_user.id,
            filename=file.filename or "document.pdf",
            file_bytes=file_bytes,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Knowledge Base not found.",
        )

    document, chunk_count = result

    return {
        "id": document.id,
        "knowledge_base_id": document.knowledge_base_id,
        "filename": document.filename,
        "file_type": document.file_type,
        "created_at": document.created_at,
        "chunk_count": chunk_count,
    }

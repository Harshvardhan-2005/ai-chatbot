from datetime import datetime

from pydantic import BaseModel, ConfigDict


class KnowledgeDocumentResponse(BaseModel):
    id: int
    knowledge_base_id: int
    filename: str
    file_type: str
    created_at: datetime
    chunk_count: int

    model_config = ConfigDict(
        from_attributes=True,
    )

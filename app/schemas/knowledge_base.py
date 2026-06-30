from datetime import datetime

from pydantic import BaseModel
from pydantic import ConfigDict


class KnowledgeBaseCreate(BaseModel):
    chatbot_id: int
    title: str
    source_type: str
    content: str


class KnowledgeBaseUpdate(BaseModel):
    title: str | None = None
    source_type: str | None = None
    content: str | None = None


class KnowledgeBaseResponse(BaseModel):
    id: int
    chatbot_id: int
    title: str
    source_type: str
    content: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
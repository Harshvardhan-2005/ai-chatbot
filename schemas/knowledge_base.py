from pydantic import BaseModel
from pydantic import Field
from datetime import datetime


class KnowledgeBaseCreate(BaseModel):
    chatbot_id: int

    title: str = Field(
        min_length=3,
        max_length=255
    )

    source_type: str = Field(
        min_length=2,
        max_length=50
    )

    content: str = Field(
        min_length=1
    )


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

    model_config = {
        "from_attributes": True
    }
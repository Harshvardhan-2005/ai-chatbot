from datetime import datetime
from typing import Literal

from pydantic import BaseModel
from pydantic import ConfigDict
from pydantic import Field


class KnowledgeBaseCreate(BaseModel):
    chatbot_id: int = Field(
        gt=0,
    )
    title: str = Field(
        min_length=1,
        max_length=255,
    )
    source_type: Literal[
        "text",
        "url",
        "file",
    ]
    content: str = Field(
        min_length=1,
    )


class KnowledgeBaseUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )
    source_type: Literal[
        "text",
        "url",
        "file",
    ] | None = None
    content: str | None = Field(
        default=None,
        min_length=1,
    )


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

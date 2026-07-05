from datetime import datetime
from typing import Literal

from pydantic import BaseModel
from pydantic import Field


class MessageCreate(BaseModel):
    conversation_id: int = Field(
        gt=0,
    )

    role: Literal[
        "user",
        "assistant",
        "system",
    ]

    content: str = Field(
        min_length=1,
    )


class MessageUpdate(BaseModel):
    role: Literal[
        "user",
        "assistant",
        "system",
    ] | None = None

    content: str | None = Field(
        default=None,
        min_length=1,
    )


class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

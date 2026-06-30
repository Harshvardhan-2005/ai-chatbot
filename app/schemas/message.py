from datetime import datetime

from pydantic import BaseModel
from pydantic import Field


class MessageCreate(BaseModel):
    conversation_id: int

    role: str = Field(
        min_length=3,
        max_length=20,
    )

    content: str = Field(
        min_length=1,
    )


class MessageUpdate(BaseModel):
    role: str | None = None
    content: str | None = None


class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
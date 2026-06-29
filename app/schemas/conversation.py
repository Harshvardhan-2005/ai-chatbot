from datetime import datetime

from pydantic import BaseModel
from pydantic import Field


class ConversationCreate(BaseModel):
    chatbot_id: int

    title: str = Field(
        min_length=3,
        max_length=255,
    )


class ConversationUpdate(BaseModel):
    title: str | None = None


class ConversationResponse(BaseModel):
    id: int
    chatbot_id: int
    title: str
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }
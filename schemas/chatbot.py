from pydantic import BaseModel
from pydantic import Field
from datetime import datetime


class ChatbotCreate(BaseModel):
    name: str = Field(
        min_length=3,
        max_length=100
    )

    description: str = Field(
        min_length=5,
        max_length=500
    )

    model_name: str = Field(
        min_length=2,
        max_length=50
    )


class ChatbotUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    model_name: str | None = None
    is_active: bool | None = None


class ChatbotResponse(BaseModel):
    id: int
    name: str
    description: str
    model_name: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }
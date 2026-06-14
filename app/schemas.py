from pydantic import BaseModel, Field
from datetime import datetime


class ChatbotBase(BaseModel):
    name: str = Field(
        min_length=2,
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

    is_active: bool = True


class ChatbotCreate(ChatbotBase):
    pass


class ChatbotUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    model_name: str | None = None
    is_active: bool | None = None


class ChatbotResponse(ChatbotBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }


class KnowledgeBaseBase(BaseModel):
    chatbot_id: int

    title: str = Field(
        min_length=2,
        max_length=255
    )

    source_type: str = Field(
        min_length=2,
        max_length=50
    )

    content: str = Field(
        min_length=5
    )


class KnowledgeBaseCreate(KnowledgeBaseBase):
    pass


class KnowledgeBaseUpdate(BaseModel):
    title: str | None = None
    source_type: str | None = None
    content: str | None = None


class KnowledgeBaseResponse(KnowledgeBaseBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }
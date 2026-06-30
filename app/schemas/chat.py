from pydantic import BaseModel
from pydantic import Field


class ChatRequest(BaseModel):
    conversation_id: int

    message: str = Field(
        min_length=1,
        max_length=5000,
    )


class ChatResponse(BaseModel):
    conversation_id: int
    user_message: str
    assistant_message: str
from fastapi import FastAPI

from app.database.session import get_db
from app.api.v1.auth import router as auth_router
from app.api.v1.chatbot import router as chatbot_router
from app.api.v1.knowledge_base import router as knowledge_base_router
from app.api.v1.conversation import router as conversation_router
from app.api.v1.message import router as message_router



app = FastAPI(
    title="Deneb AI Chatbot Platform",
    description="Backend APIs for Project Deneb",
    version="1.0.0",
)

app.include_router(chatbot_router)
app.include_router(knowledge_base_router)
app.include_router(conversation_router)
app.include_router(message_router)
app.include_router(auth_router)


@app.get("/", tags=["System"])
def root():
    return {
        "message": "Deneb AI Chatbot Platform API"
    }
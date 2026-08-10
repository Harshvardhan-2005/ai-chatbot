from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.auth import router as auth_router
from app.api.v1.chat import router as chat_router
from app.api.v1.chatbot import router as chatbot_router
from app.api.v1.conversation import router as conversation_router
from app.api.v1.knowledge_base import router as knowledge_base_router
from app.api.v1.message import router as message_router


app = FastAPI(
    title="Deneb AI Chatbot Platform",
    description="Backend APIs for Project Deneb",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://deneb-ai-chatbot.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(chatbot_router)
app.include_router(knowledge_base_router)
app.include_router(conversation_router)
app.include_router(message_router)
app.include_router(auth_router)
app.include_router(chat_router)


@app.get("/", tags=["System"])
def root():
    return {
        "message": "Deneb AI Chatbot Platform API"
    }
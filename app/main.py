from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from app.crud import *
from app.database import Base, engine, get_db
from app.models import Chatbot, KnowledgeBase
from app.schemas import *

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Deneb AI Chatbot Platform",
    description="Backend APIs for Project Deneb",
    version="1.0.0"
)


@app.get("/", tags=["System"])
def root():
    return {
        "message": "Deneb AI Chatbot Platform API"
    }


@app.post(
    "/chatbots",
    response_model=ChatbotResponse,
    status_code=201
)
def create_chatbot_api(
    chatbot: ChatbotCreate,
    db: Session = Depends(get_db)
):
    return create_chatbot(
        db,
        chatbot
    )


@app.get(
    "/chatbots",
    response_model=list[ChatbotResponse]
)
def get_chatbots_api(
    page: int = 1,
    size: int = 10,
    db: Session = Depends(get_db)
):
    skip = (page - 1) * size

    return get_chatbots(
        db,
        skip,
        size
    )


@app.get("/chatbots/search/")
def search_chatbots_api(
    keyword: str,
    db: Session = Depends(get_db)
):
    return search_chatbots(
        db,
        keyword
    )


@app.get(
    "/chatbots/{chatbot_id}",
    response_model=ChatbotResponse
)
def get_chatbot_api(
    chatbot_id: int,
    db: Session = Depends(get_db)
):
    chatbot = get_chatbot(
        db,
        chatbot_id
    )

    if not chatbot:
        raise HTTPException(
            status_code=404,
            detail="Chatbot not found"
        )

    return chatbot


@app.put(
    "/chatbots/{chatbot_id}",
    response_model=ChatbotResponse
)
def update_chatbot_api(
    chatbot_id: int,
    chatbot: ChatbotUpdate,
    db: Session = Depends(get_db)
):
    updated = update_chatbot(
        db,
        chatbot_id,
        chatbot
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Chatbot not found"
        )

    return updated


@app.delete(
    "/chatbots/{chatbot_id}"
)
def delete_chatbot_api(
    chatbot_id: int,
    db: Session = Depends(get_db)
):
    success = delete_chatbot(
        db,
        chatbot_id
    )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Chatbot not found"
        )

    return {
        "message": "Chatbot deleted successfully"
    }


@app.post(
    "/knowledge-bases",
    response_model=KnowledgeBaseResponse,
    status_code=201
)
def create_knowledge_base_api(
    knowledge_base: KnowledgeBaseCreate,
    db: Session = Depends(get_db)
):
    return create_knowledge_base(
        db,
        knowledge_base
    )
@app.get(
    "/knowledge-bases",
    response_model=list[KnowledgeBaseResponse]
)
def get_knowledge_bases_api(
    page: int = 1,
    size: int = 10,
    db: Session = Depends(get_db)
):
    skip = (page - 1) * size

    return get_knowledge_bases(
        db,
        skip,
        size
    )        

@app.get(
    "/knowledge-bases/search/"
)
def search_knowledge_bases_api(
    keyword: str,
    db: Session = Depends(get_db)
):
    return search_knowledge_bases(
        db,
        keyword
    )

@app.get(
    "/knowledge-bases/{kb_id}",
    response_model=KnowledgeBaseResponse
)
def get_knowledge_base_api(
    kb_id: int,
    db: Session = Depends(get_db)
):
    kb = get_knowledge_base(
        db,
        kb_id
    )

    if not kb:
        raise HTTPException(
            status_code=404,
            detail="Knowledge base not found"
        )

    return kb

@app.put(
    "/knowledge-bases/{kb_id}",
    response_model=KnowledgeBaseResponse
)
def update_knowledge_base_api(
    kb_id: int,
    knowledge_base: KnowledgeBaseUpdate,
    db: Session = Depends(get_db)
):
    updated = update_knowledge_base(
        db,
        kb_id,
        knowledge_base
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Knowledge base not found"
        )

    return updated

@app.delete(
    "/knowledge-bases/{kb_id}"
)
def delete_knowledge_base_api(
    kb_id: int,
    db: Session = Depends(get_db)
):
    success = delete_knowledge_base(
        db,
        kb_id
    )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Knowledge base not found"
        )

    return {
        "message": "Knowledge base deleted successfully"
    }        
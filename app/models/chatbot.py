from sqlalchemy import Boolean
from sqlalchemy import DateTime
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from datetime import datetime

from app.database.base import Base

class Chatbot(Base):
    __tablename__ = "chatbots"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    description: Mapped[str] = mapped_column(
        String(500),
        nullable=False
    )

    model_name: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    knowledge_bases = relationship(
    "KnowledgeBase",
    back_populates="chatbot",
    cascade="all, delete",
    )

    conversations = relationship(
    "Conversation",
    back_populates="chatbot",
    cascade="all, delete",
    )
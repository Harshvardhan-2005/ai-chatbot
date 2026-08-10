from datetime import datetime

from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from app.database.base import Base


class KnowledgeDocument(Base):
    __tablename__ = "knowledge_documents"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    knowledge_base_id: Mapped[int] = mapped_column(
        ForeignKey("knowledge_bases.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    file_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    knowledge_base = relationship(
        "KnowledgeBase",
        back_populates="documents",
    )

    chunks = relationship(
        "KnowledgeChunk",
        back_populates="document",
        cascade="all, delete-orphan",
    )

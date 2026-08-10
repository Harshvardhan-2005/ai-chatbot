from datetime import datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import Text
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from app.database.base import Base


class KnowledgeChunk(Base):
    __tablename__ = "knowledge_chunks"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    document_id: Mapped[int] = mapped_column(
        ForeignKey("knowledge_documents.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    chunk_index: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    # all-MiniLM-L6-v2 generates 384-dimensional embeddings.
    embedding: Mapped[list[float] | None] = mapped_column(
    Vector(384),
    nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    document = relationship(
        "KnowledgeDocument",
        back_populates="chunks",
    )

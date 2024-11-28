from uuid import UUID, uuid4

from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.dialects.postgresql import TEXT as PG_TEXT


class Base(DeclarativeBase):
    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), unique=True, primary_key=True, index=True, default=uuid4)


class User(Base):
    __tablename__ = "users"

    username: Mapped[str] = mapped_column(unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(unique=True, index=True, nullable=False)

class File(Base):
    __tablename__ = "files"
    creator_id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), index=True, nullable=False)
    data: Mapped[str] = mapped_column(PG_TEXT(), nullable=False)
    chunk_number: Mapped[int] = mapped_column()
    tag_1: Mapped[str] = mapped_column(nullable=True)
    tag_2: Mapped[str] = mapped_column(nullable=True)
    tag_3: Mapped[str] = mapped_column(nullable=True)

class Chunk(Base):
    __tablename__ = "chunks"

    file_id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), index=True, nullable=False)
    embed: Mapped[str] = mapped_column(nullable=True)
    chunk_number: Mapped[int] = mapped_column(PG_TEXT(), nullable=False)
    ts_chunk_vector: Mapped[str] = mapped_column(nullable=True)
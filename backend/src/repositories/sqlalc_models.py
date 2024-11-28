from uuid import UUID, uuid4

from sqlalchemy import LargeBinary
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.dialects.postgresql import TEXT as PG_TEXT


class Base(DeclarativeBase):
    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), unique=True, primary_key=True, index=True, default=uuid4)


class User(Base):
    __tablename__ = "users"

    username: Mapped[str] = mapped_column(unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(unique=True, index=True, nullable=False)

class File(Base):
    __tablename__ = "files"

    assistant_id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), index=True, nullable=False)
    data: Mapped[str] = mapped_column(PG_TEXT(), nullable=False)
    chunk_number: Mapped[int] = mapped_column(nullable=False)
    tag_1: Mapped[str | None] = mapped_column(nullable=True)
    tag_2: Mapped[str | None] = mapped_column(nullable=True)
    tag_3: Mapped[str | None] = mapped_column(nullable=True)

class Assistant(Base):
    __tablename__ = "assistants"

    creator_id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True),index=True, nullable=False)
    name: Mapped[str] = mapped_column(nullable=False)
    icon: Mapped[bytes | None] = mapped_column(nullable=True)
    main_color: Mapped[str] = mapped_column(nullable=False)
    theme: Mapped[str] = mapped_column(nullable=False)
    website_url: Mapped[str] = mapped_column(nullable=False)
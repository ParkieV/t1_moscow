from typing import Literal
from uuid import UUID

from fastapi import UploadFile
from pydantic import Field, BaseModel

from src.schemas.user import CustomBaseModel

class AssistantCreateBodyDTO(CustomBaseModel):
    name: str
    icon: str | bytes | None = Field(default=None)
    main_color: str
    theme: Literal['dark', 'light']
    website_url: str

class AssistantCreateDTO(AssistantCreateBodyDTO):
    creator_id: UUID | None = None

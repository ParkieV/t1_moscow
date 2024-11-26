from uuid import UUID

from dependency_injector.providers import Factory
from pydantic import BaseModel, Field


class CustomBaseModel(BaseModel):
    id: UUID = Field(default_factory=Factory(UUID))


class UserOutDTO(CustomBaseModel):
    username: str
    hashed_password: str

    model_config = {
        'extra': 'allow'
    }
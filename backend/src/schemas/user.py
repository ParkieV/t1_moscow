from uuid import UUID, uuid4

from dependency_injector.providers import Factory
from pydantic import BaseModel, Field, EmailStr


class CustomBaseModel(BaseModel):
    id: UUID = Field(default=uuid4())


class UserOutDTO(CustomBaseModel):
    username: str
    hashed_password: str

    model_config = {
        'extra': 'allow'
    }

class UserReginsterInDTO(CustomBaseModel):
    username: str
    email: EmailStr
    password: str
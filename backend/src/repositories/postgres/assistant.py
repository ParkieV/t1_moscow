from uuid import UUID

from sqlalchemy import select

from src.logger import logger
from src.repositories.postgres.base_crud import BasePostgresCRUD
from src.repositories.sqlalc_models import Assistant
from src.schemas.assistants import AssistantCreateDTO


class AssistantCRUD(BasePostgresCRUD):

    model = Assistant

    async def add_assistant(self, assistant_info: AssistantCreateDTO) -> UUID:
        new_assistant = Assistant(**assistant_info.model_dump())

        async with self.session_factory() as session:
            try:
                session.add(new_assistant)
                await session.flush()
                assistant_id = new_assistant.id
                await session.commit()
                return assistant_id
            except Exception as e:
                logger.error(f"Failed to add assistant to database. {e.__class__.__name__}: {e}")
                await session.rollback()
                raise e

    async def get_assistants_by_user_id(self, user_id: UUID) -> list[Assistant]:
        async with self.session_factory() as session:
            try:
                query = select(Assistant).where(Assistant.creator_id == user_id)
                result = (await session.execute(query)).scalars().all()
                return [AssistantCreateDTO.model_validate(row, from_attributes=True) for row in result]
            except Exception as e:
                logger.error(f"Failed to add assistant to database. {e.__class__.__name__}: {e}")
                raise e
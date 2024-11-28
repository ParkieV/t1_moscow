from typing import Any
from uuid import UUID

from attrs import define

from src.logger import logger
from src.repositories.postgres.base_crud import BasePostgresCRUD
from src.repositories.sqlalc_models import File


@define
class FileCRUD(BasePostgresCRUD):
    model = File

    async def insert_file(self, assistant_id: UUID, file: list[dict[str, Any]]) -> None:
        file = File(assistant_id=assistant_id,
                    data=' '.join([page_info["text"] for page_info in file]))
        logger.debug(f"file's id: {file.id}")
        async with self.session_factory() as session:
            try:
                logger.debug(f'session: {session}, {file}')
                session.add(file)
                await session.commit()
            except Exception as e:
                await session.rollback()
                logger.error(f"Error while inserting file, {e.__class__.__name__}: {e}")
                raise e

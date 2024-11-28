from typing import Any
from uuid import uuid4

from attrs import define

from src.logger import logger
from src.repositories.postgres.base_crud import BasePostgresCRUD
from src.repositories.sqlalc_models import File, Chunk


@define
class FileCRUD(BasePostgresCRUD):
    model = File

    async def insert_file(self, file: list[dict[str, Any]]) -> None:
        file = File(data=' '.join([page_info["text"] for page_info in file]),
                    creator_id=uuid4())
        async with self.session_factory() as session:
            try:
                logger.debug(f'session: {session}, {file}')
                session.add(file)
                await session.commit()
            except Exception as e:
                logger.error(f"Error while inserting file, {e.__class__.__name__}: {e}")
                raise e

@define
class ChunkCRUD(BasePostgresCRUD):
    model = Chunk
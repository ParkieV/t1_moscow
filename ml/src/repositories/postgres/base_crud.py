from typing import TypeVar, Any, AsyncGenerator, AsyncContextManager

from attrs import define
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.logger import logger
from src.repositories.sqlalc_models import Base

BaseDBModel = TypeVar('BaseDBModel', bound=Base)
ModelDTO = TypeVar('ModelDTO', bound=BaseModel)

@define
class BasePostgresCRUD:

    session_factory: Any = None

    model: BaseDBModel | str = None

    async def get_object(self,
                         model_id: int,
                         *,
                         out_schema: ModelDTO | None) -> ModelDTO:

        result: BaseDBModel | None = None

        try:
            async with self.session_factory() as session:
                result = await session.execute(select(self.model).where(self.model.id == model_id))
        except Exception as e:
            logger.error(f"Could not get object by id '{model_id}': {e.__class__.__name__}: {e}")

        if result is None:
            raise ValueError('User not found')

        return out_schema.model_validate(result)

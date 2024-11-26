from attrs import define
from sqlalchemy import select

from src.logger import logger
from src.repositories.postgres.base_crud import BasePostgresCRUD, BaseDBModel, ModelDTO

from src.repositories.sqlalc_models import User

@define
class UserCRUD(BasePostgresCRUD):
    """ Класс для базовых операций с таблицей 'users' """

    model: BaseDBModel = User

    async def get_user_by_username(self, username: str, *, out_schema: type[ModelDTO]) -> ModelDTO:

        try:
            logger.debug(f"user {self.model}")
            async with self.session_factory() as session:
                # query = text(f"""
                #     SELECT * FROM users;
                # """)
                query = select(self.model).where(self.model.username == username)
                result = (await session.execute(query)).scalar_one_or_none()
        except Exception as e:
            logger.error(f"Could not get user by username'{username}': {e.__class__.__name__}: {e}")
            raise e

        logger.debug(result)

        if result is None:
            raise ValueError('User not found')

        logger.debug(result)
        return out_schema.model_validate(result, from_attributes=True)
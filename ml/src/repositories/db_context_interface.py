from typing import Protocol, TypeVar, Any

from src.repositories.postgres.base_crud import BasePostgresCRUD

BaseCRUD = TypeVar('BaseCRUD', bound=Any)

class DBContextInterface(Protocol):

    @property
    def crud(self) -> BasePostgresCRUD:
        ...

    @crud.setter
    def crud(self, crud: BasePostgresCRUD):
        ...

    @classmethod
    async def check_connection(cls) -> None:
        ...
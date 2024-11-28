from typing import Any
from uuid import UUID

from fastapi import APIRouter
from fastapi.params import Depends

from src.services.utils import check_token

router = APIRouter(prefix='/assistants')


@router.post('/{assistant_id}/query', dependencies=[Depends(check_token)])
async def assistant_query(assistant_id: UUID, query: str):
    pass

@router.post('/{assistant_id}/load_embeddings', dependencies=[Depends(check_token)])
async def assistant_load_embeddings(assistant_id: UUID, files: list[list[dict[str, Any]]]):
    pass
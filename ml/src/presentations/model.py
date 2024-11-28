from typing import Any
from uuid import UUID

from fastapi import APIRouter, HTTPException
from fastapi.params import Depends, Body

from src.logger import logger
from src.services.ml import load_embeddings, get_answer
from src.services.utils import check_token

router = APIRouter(prefix='/assistants')


@router.post('/{assistant_id}/query', dependencies=[Depends(check_token)])
async def assistant_query(assistant_id: UUID, query: str = Body(...)):
    # return "Привет"
    try:
        return await get_answer(query, assistant_id)
    except Exception as e:
        logger.error(f"Failed to load embeddings: {e.__class__.__name__}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post('/{assistant_id}/load_embeddings')
async def assistant_load_embeddings(assistant_id: UUID, files: list[list[dict[str, Any]]]):
    try:
        await load_embeddings(files, assistant_id)
    except Exception as e:
        logger.error(f"Failed to load embeddings: {e.__class__.__name__}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
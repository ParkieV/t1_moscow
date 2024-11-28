from uuid import UUID

from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends, Query

from src.services.parse_data import parse_files
from src.services.utils import check_token

router = APIRouter(prefix="/data", tags=["endpoints to work with data"])


@router.post('/upload', dependencies=[Depends(check_token)])
async def upload_files(assistant_id: UUID = Query(...),
                       files: list[UploadFile] = File(...)):
    if len(files) < 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    return await parse_files(files, assistant_id)
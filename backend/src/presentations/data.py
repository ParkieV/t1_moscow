from uuid import UUID

from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends, Query, Body

from src.services.parse_data import parse_files
from src.services.utils import check_token

router = APIRouter(prefix="/data", tags=["endpoints to work with data"])


@router.post('/upload_files', dependencies=[Depends(check_token)])
async def upload_files(assistant_id: UUID = Query(...),
                       files: list[UploadFile] = File(...)):
    if len(files) < 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    try:
        return await parse_files(files, [], assistant_id)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post('/upload_urls', dependencies=[Depends(check_token)])
async def upload_urls(assistant_id: UUID = Query(...),
                      urls: str = Body(...)):
    urls = urls.split(',')
    if len(urls) < 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    try:
        return await parse_files([], urls, assistant_id)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

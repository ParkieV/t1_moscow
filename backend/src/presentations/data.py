from fastapi import APIRouter, UploadFile, File, HTTPException, status

from src.services.parse_data import parse_files

router = APIRouter(prefix="/data", tags=["endpoints to work with data"])


@router.post('/upload')
async def upload_files(files: list[UploadFile] = File(...)):
    if len(files) < 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    await parse_files(files)
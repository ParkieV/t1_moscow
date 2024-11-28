from fastapi import APIRouter

from src.presentations import *

router = APIRouter()

router.include_router(model_router)
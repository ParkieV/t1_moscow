from fastapi import Depends, APIRouter, HTTPException, status

from src.repositories.postgres import UserCRUD, PostgresContext
from src.schemas.user import UserOutDTO
from src.services.utils import check_token


router = APIRouter(tags=["Authorization Endpoints"])


@router.get("/users/{username}", response_model=UserOutDTO, dependencies=[Depends(check_token)])
async def read_user_info(username: str) -> UserOutDTO:
    db_context = PostgresContext[UserCRUD](crud=UserCRUD(PostgresContext.new_session()))
    try:
        return await db_context.crud.get_user_by_username(username, out_schema=UserOutDTO)
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

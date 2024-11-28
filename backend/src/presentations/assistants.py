import base64

from fastapi import APIRouter, status, Body, Depends, HTTPException

from src.logger import logger
from src.repositories.postgres import PostgresContext, UserCRUD
from src.repositories.postgres.assistant import AssistantCRUD
from src.schemas.assistants import AssistantCreateDTO, AssistantCreateBodyDTO
from src.schemas.user import UserOutDTO
from src.services.utils import check_token

router = APIRouter(prefix="/assistants", tags=["assistants"])

@router.post('/create', status_code=status.HTTP_201_CREATED)
async def create_assistant(assistant_info: AssistantCreateBodyDTO = Body(...), username = Depends(check_token)):

    # Получение айдишника пользователя
    db_user_context = PostgresContext[UserCRUD](crud=UserCRUD(PostgresContext.new_session))
    try:
        user_id = (await db_user_context.crud.get_user_by_username(username, out_schema=UserOutDTO)).id
    except Exception as e:
        logger.error(f"Getting info about user is failed. {e.__class__.__name__}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    db_assistant_context = PostgresContext[AssistantCRUD](crud=AssistantCRUD(PostgresContext.new_session))

    assistant = AssistantCreateDTO(id=assistant_info.id,
                                   name=assistant_info.name,
                                   icon=assistant_info.icon,
                                   main_color=assistant_info.main_color,
                                   theme=assistant_info.theme,
                                   website_url=assistant_info.website_url)
    assistant.creator_id = user_id

    assistant.icon = base64.b64decode(assistant.icon)

    try:
        return await db_assistant_context.crud.add_assistant(assistant)
    except Exception as e:
        logger.error(f"Adding assistant to database is failed. {e.__class__.__name__}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

@router.get('')
async def get_assistants(username = Depends(check_token)):
    # Получение айдишника пользователя
    db_user_context = PostgresContext[UserCRUD](crud=UserCRUD(PostgresContext.new_session))
    try:
        user_id = (await db_user_context.crud.get_user_by_username(username, out_schema=UserOutDTO)).id
    except Exception as e:
        logger.error(f"Getting info about user is failed. {e.__class__.__name__}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    db_assistant_context = PostgresContext[AssistantCRUD](crud=AssistantCRUD(PostgresContext.new_session))

    try:
        return await db_assistant_context.crud.get_assistants_by_user_id(user_id)
    except Exception as e:
        logger.error(f"Adding assistant to database is failed. {e.__class__.__name__}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


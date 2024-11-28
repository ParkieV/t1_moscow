from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.presentations.api import router
from src.repositories.postgres import PostgresContext

from src.repositories.sqlalc_models import Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    db_context = PostgresContext()
    await db_context.check_connection()
    yield

app = FastAPI(lifespan=lifespan, root_path="/api_ml")
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)

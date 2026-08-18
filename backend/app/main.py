from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.router import router
from app.db import pool


@asynccontextmanager
async def lifespan(app: FastAPI):
    await pool.open()

    yield

    await pool.close()


app = FastAPI(lifespan=lifespan)

app.include_router(router)
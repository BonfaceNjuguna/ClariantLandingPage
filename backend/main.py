from fastapi import FastAPI
from app.api.routes import auth
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(auth.router, prefix="/auth", tags=["auth"])

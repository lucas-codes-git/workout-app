from fastapi import APIRouter

from app.api.routes.workouts import router as workouts_router

router = APIRouter()

router.include_router(workouts_router)
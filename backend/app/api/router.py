from fastapi import APIRouter

from app.api.routes.workouts import router as workouts_router
from app.api.routes.exercises import router as exercises_router

router = APIRouter()

router.include_router(workouts_router)
router.include_router(exercises_router)
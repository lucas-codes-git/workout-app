from fastapi import APIRouter

from app.api.routes.workouts import router as workouts_router
from app.api.routes.exercises import router as exercises_router
from app.api.routes.workout_exercises import router as workout_exercises_router
from app.api.routes.sets import router as sets_router

router = APIRouter()

router.include_router(workouts_router)
router.include_router(exercises_router)
router.include_router(workout_exercises_router)
router.include_router(sets_router)
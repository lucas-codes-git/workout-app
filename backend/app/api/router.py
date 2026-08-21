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

# example workout_id = 73061739-76df-4471-99ae-76a10d7a1964
# example exercise_id = 996c352c-794e-4e74-9da1-289d763a2785
# example workout_exercise_id = 8b3e3abc-24f3-4330-9910-a2eecabc82aa
# example set_id = dc3954d0-b1e5-46b1-ac84-0a408cc3d757
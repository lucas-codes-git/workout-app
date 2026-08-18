from fastapi import APIRouter
from app.services import WorkoutService
from app.db.models.workouts import Workouts
from app.schemas.workout import WorkoutCreate, WorkoutResponse

workout_service = WorkoutService()

router = APIRouter(prefix="/workouts", tags=["workouts"])

@router.get("")
async def get_workouts(workout: WorkoutResponse):
    return await workout_service.get_workouts()

@router.get("/{workout_id}")
async def get_workout(workout_id: int):
    return await workout_service.get_workout(workout_id=workout_id)

@router.post("")
async def create_workouts(workout: WorkoutCreate):
    return await workout_service.create_workout(workout=workout)

@router.put("/{workout_id}")
async def update_workout(workout_id: int):
    return await workout_service.update_workout(workout_id=workout_id)
    
@router.delete("/{workout_id}")
async def delete_workout(workout_id: int):
    return await workout_service.delete_workout(workout_id=workout_id)
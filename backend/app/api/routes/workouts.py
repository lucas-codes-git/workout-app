from fastapi import APIRouter
from app.services import WorkoutService
from app.schemas.workout import WorkoutCreate, WorkoutResponse, WorkoutUpdate
from uuid import UUID

workout_service = WorkoutService()

router = APIRouter(prefix="/workouts", tags=["Workouts"])

@router.get("")
async def get_workouts() -> list[WorkoutResponse]:
    return await workout_service.get_workouts()

@router.get("/{workout_id}")
async def get_workout(workout_id: UUID):
    return await workout_service.get_workout(workout_id=workout_id)

@router.post("")
async def create_workouts(workout: WorkoutCreate):
    return await workout_service.create_workout(workout=workout)

@router.put("/{workout_id}")
async def update_workout(workout_id: UUID, workout_updates: WorkoutUpdate):
    return await workout_service.update_workout(workout_id=workout_id, workout=workout_updates)
    
@router.delete("/{workout_id}")
async def delete_workout(workout_id: UUID):
    return await workout_service.delete_workout(workout_id=workout_id)
from fastapi import APIRouter
from app.db.models.exercises import Exercises
from app.schemas.exercises import ExerciseUpdate, ExerciseResponse, ExerciseCreate
from app.services.exercise_service import ExerciseService
from uuid import UUID

exercise_service = ExerciseService()

router = APIRouter(prefix="/exercises", tags=["Exercises"])

@router.get("")
async def get_exercises() -> list[ExerciseResponse]:
    return await exercise_service.get_exercises()

@router.post("")
async def create_exercise(exercise: ExerciseCreate):
    return await exercise_service.create_exercise(exercise=exercise)

@router.put("/{exercise_id}")
async def update_exercise(exercise_id: UUID, exercise_updates: ExerciseUpdate):
    return await exercise_service.update_exercise(exercise_id=exercise_id, exercise=exercise_updates)

@router.delete("/{exercise_id}")
async def delete_exercise(exercise_id: UUID):
    return await exercise_service.delete_exercise(exercise_id=exercise_id)
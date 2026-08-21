from fastapi import APIRouter, HTTPException, status
from uuid import UUID

from app.schemas.workout_exercises import (
    WorkoutExerciseUpdate,
    WorkoutExerciseCreate,
    WorkoutExerciseResponse
)

from app.services.workout_exercise_service import WorkoutExerciseService

router = APIRouter(prefix="/workouts", tags=["Workout Exercises"])

service = WorkoutExerciseService()

@router.get("/{workout_id}/exercises", response_model=list[WorkoutExerciseResponse], status_code=status.HTTP_200_OK)
async def get_workout_exercises(workout_id: UUID):
    return await service.get_workout_exercises(workout_id=workout_id)

@router.get("/{workout_id}/exercises/{exercise_id}", response_model=WorkoutExerciseResponse, status_code=status.HTTP_200_OK)
async def get_workout_exercise(workout_id: UUID, exercise_id: UUID):
    workout_exercise = await service.get_workout_exercise(workout_id=workout_id, exercise_id=exercise_id)
    
    if workout_exercise is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found in workout"
        )
        
    return workout_exercise
@router.post("/{workout_id}/exercises", response_model=WorkoutExerciseResponse, status_code=status.HTTP_201_CREATED)
async def create_workout_exercisse(workout_id: UUID, workout_exercise: WorkoutExerciseCreate):
    try:
        return await service.create_workout_exercise(workout_id=workout_id, workout=workout_exercise)
    
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to add exercise to workout"
        )

@router.patch("/{workout_id}/exercises/{exercise_id}", response_model=WorkoutExerciseResponse, status_code=status.HTTP_200_OK)
async def update_workout_exercise_order(workout_id: UUID, exercise_id: UUID, workout_update: WorkoutExerciseUpdate):
    workout_exercise =  await service.update_workout_exercise(workout_id=workout_id, exercise_id=exercise_id, workout=workout_update)
    
    if workout_exercise is None:
        raise HTTPException(
            status_code=404,
            detail="Exercise not found in workout"
        )
    
    return workout_exercise

@router.delete("/{workout_id}/exercises/{exercise_id}", response_model=WorkoutExerciseResponse)
async def delete_workout_exercise(workout_id: UUID, exercise_id: UUID):
    workout_exercise =  await service.delete_workout_exercise(workout_id=workout_id, exercise_id=exercise_id)
    
    if workout_exercise is None:
        raise HTTPException(
            status_code=404,
            detail="Exercise not found in workout"
        )
    
    return workout_exercise
    
    
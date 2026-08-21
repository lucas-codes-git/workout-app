from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class WorkoutExerciseCreate(BaseModel):
    exercise_id: UUID
    exercise_order: int


class WorkoutExerciseResponse(BaseModel):
    id: UUID
    workout_id: UUID
    exercise_id: UUID
    exercise_order: int
    created_at: datetime
    updated_at: datetime


class WorkoutExerciseUpdate(BaseModel):
    exercise_order: int
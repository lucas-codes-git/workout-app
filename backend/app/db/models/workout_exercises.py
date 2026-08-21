from dataclasses import dataclass
from datetime import datetime
from uuid import UUID


@dataclass
class WorkoutExercise:
    id: UUID
    workout_id: UUID
    exercise_id: UUID
    exercise_order: int
    created_at: datetime
    updated_at: datetime
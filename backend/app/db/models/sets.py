from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from uuid import UUID


@dataclass
class Sets:
    id: UUID
    workout_exercise_id: UUID
    set_number: int
    weight: Decimal
    reps: int
    rir: int
    notes: str | None
    created_at: datetime
    updated_at: datetime
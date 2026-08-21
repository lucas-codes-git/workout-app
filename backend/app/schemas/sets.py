from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from uuid import UUID


class SetsCreate(BaseModel):
    weight: Decimal
    reps: int
    rir: int
    notes: str | None = None

class SetsResponse(BaseModel):
    id: UUID
    workout_exercise_id: UUID
    set_number: int
    weight: Decimal
    reps: int
    rir: int
    notes: str | None
    created_at: datetime
    updated_at: datetime

class SetsUpdate(BaseModel):
    weight: Decimal
    reps: int
    rir: int
    notes: str | None = None
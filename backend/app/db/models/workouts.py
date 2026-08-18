from dataclasses import dataclass
from datetime import date, datetime
from uuid import UUID


@dataclass
class Workouts:
    id: UUID
    name: str
    workout_date: date
    notes: str | None
    created_at: datetime
    updated_at: datetime | None
from datetime import date
from pydantic import BaseModel



class WorkoutCreate(BaseModel):
    name: str
    workout_date: date
    notes: str | None = None


class WorkoutResponse(BaseModel):
    name: str
    workout_date: date
    notes: str | None
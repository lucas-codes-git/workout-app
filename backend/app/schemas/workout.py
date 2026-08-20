from datetime import date
from pydantic import BaseModel
from datetime import datetime
from uuid import UUID



class WorkoutCreate(BaseModel):
    name: str
    workout_date: date
    notes: str | None = None


class WorkoutResponse(BaseModel):
    id: UUID
    name: str
    workout_date: date
    notes: str | None
    created_at: datetime
    updated_at: datetime
    
class WorkoutUpdate(BaseModel):
    name: str | None = None
    notes: str | None = None
    workout_date: date | None = None
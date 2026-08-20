from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class ExerciseCreate(BaseModel):
    name: str
    notes: str | None = None
    
class ExerciseResponse(BaseModel):
    id: UUID
    name: str
    notes: str | None
    created_at: datetime
    updated_at: datetime
    
class ExerciseUpdate(BaseModel):
    name: str
    notes: str | None = None
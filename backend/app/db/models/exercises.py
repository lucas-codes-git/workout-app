from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

@dataclass
class Exercises:
    id: UUID
    name: str
    notes: str | None
    created_at: datetime
    updated_at: datetime | None
    
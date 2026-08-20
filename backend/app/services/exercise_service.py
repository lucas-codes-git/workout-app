from app.db.models.exercises import Exercises
from app.schemas.exercises import ExerciseCreate, ExerciseResponse, ExerciseUpdate
from app.db import pool
from uuid import UUID

class ExerciseService:
    
    async def get_exercises(self) -> list[Exercises]:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    SELECT
                        id,
                        name,
                        notes,
                        created_at,
                        updated_at
                    FROM exercises
                    ORDER BY created_at DESC;
                    """,
                )
                
                rows = await cur.fetchall()
                
        return [Exercises(*row) for row in rows]
    
    async def create_exercise(self, exercise: Exercises) -> Exercises:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    INSERT INTO exercises (name, notes)
                    VALUES (%s, %s)
                    RETURNING id, name, notes, created_at, updated_at;
                    """,
                    (exercise.name, exercise.notes,),
                )
                row = await cur.fetchone()
                            
        return Exercises(*row)
    
    async def update_exercise(self, exercise_id: UUID, exercise: ExerciseUpdate) -> Exercises:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    UPDATE exercises
                    SET
                        name = %s,
                        notes = %s
                    WHERE id = %s
                    RETURNING id, name, notes, created_at, updated_at;
                    """,
                    (exercise.name, exercise.notes, exercise_id,),
                )
                row = await cur.fetchone()
        
            if row is None:
                return None
                
        return Exercises(*row)
    
    async def delete_exercise(self, exercise_id: UUID) -> Exercises | None:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    DELETE FROM exercises
                    WHERE id = %s
                    RETURNING id, name, notes, created_at, updated_at;
                    """,
                    (exercise_id,),
                )
                row = await cur.fetchone()
                        
            if row is None:
                return None
                
        return Exercises(*row)
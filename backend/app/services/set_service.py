from app.db.models.sets import Sets
from app.schemas.sets import SetsUpdate, SetsCreate
from app.db import pool
from uuid import UUID

class SetService:
    
    async def get_sets(self, workout_exercise_id: UUID) -> list[Sets]:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    SELECT
                        id,
                        workout_exercise_id,
                        set_number,
                        weight,
                        reps,
                        rir,
                        notes,
                        created_at,
                        updated_at
                    FROM sets
                    WHERE workout_exercise_id = %s
                    ORDER BY set_number ASC;
                    """,
                    (workout_exercise_id,),
                )
                rows = await cur.fetchall()
                
        return [Sets(*row) for row in rows]
    
    async def get_set(self, set_id: UUID) -> Sets | None:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    SELECT
                        id,
                        workout_exercise_id,
                        set_number,
                        weight,
                        reps,
                        rir,
                        notes,
                        created_at,
                        updated_at
                    FROM sets
                    WHERE id = %s;
                    """,
                    (set_id,),
                )
                row = await cur.fetchone()

        if row is None:
            return None

        return Sets(*row)
                
    
    async def create_set(self, set: SetsCreate, workout_exercise_id: UUID) -> Sets:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    INSERT INTO sets (workout_exercise_id, set_number, weight, reps, rir, notes)
                    VALUES (%s,(
                            SELECT COALESCE(MAX(set_number), 0) + 1
                            FROM sets
                            WHERE workout_exercise_id = %s
                        ),
                        %s, %s, %s, %s)
                    RETURNING id, workout_exercise_id, set_number, weight, reps, rir, notes, created_at, updated_at;
                    """,
                    (workout_exercise_id, workout_exercise_id, set.weight, set.reps, set.rir, set.notes,),
                )
            
                row = await cur.fetchone()
                                        
        return Sets(*row)
    
    async def update_set(self, set: SetsUpdate, set_id: UUID) -> Sets | None:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    UPDATE sets
                    SET
                        weight = %s,
                        reps = %s,
                        rir = %s,
                        notes = %s,
                        updated_at = NOW()
                    WHERE id = %s
                    RETURNING id, workout_exercise_id, set_number, weight, reps, rir, notes, created_at, updated_at;
                    """,
                    (set.weight, set.reps, set.rir, set.notes, set_id,),
                )
                
                row = await cur.fetchone()
        if row is None:
            return None
        
        return Sets(*row)
    
    async def delete_set(self, set_id: UUID) -> Sets | None:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    DELETE FROM sets
                    WHERE id = %s
                    RETURNING id, workout_exercise_id, set_number, weight, reps, rir, notes, created_at, updated_at;
                    """,
                    (set_id,),
                )
                
                row = await cur.fetchone()
        if row is None:
            return None
        
        return Sets(*row)
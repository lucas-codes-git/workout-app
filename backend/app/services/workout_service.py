from app.db.models.workouts import Workouts
from app.db import pool
from uuid import UUID

class WorkoutService:

    async def get_workouts(self) -> list[Workouts]:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    SELECT
                        id,
                        name,
                        workout_date,
                        notes,
                        created_at,
                        updated_at
                    FROM workouts
                    ORDER BY workout_date DESC;
                    """
                )

                rows = await cur.fetchall()

        return [Workouts(*row) for row in rows]
    
    async def get_workout(self, workout_id: UUID) -> Workouts | None:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    SELECT
                        id, name, workout_date, notes, created_at, updated_at
                    FROM workouts
                    WHERE id = %s;
                    """,
                    (workout_id,),
                )
                row = await cur.fetchone()
                
        if row is None:
            return None
        
        return Workouts(*row)
    
    async def create_workout(self, workout: Workouts) -> Workouts:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    INSERT INTO workouts (name, workout_date, notes)
                    VALUES (%s, %s, %s)
                    RETURNING id, name, workout_date, notes, created_at, updated_at;
                    """,
                    (workout.name, workout.workout_date, workout.notes,),
                )
                row = await cur.fetchone()
                
        return Workouts(*row)
    
    async def update_workout(self, workout_id: UUID, workout: Workouts) -> Workouts | None:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    UPDATE workouts
                    SET 
                        name = %s,
                        workout_date = %s,
                        notes = %s
                    WHERE id = %s
                    RETURNING id, name, workout_date, notes, created_at, updated_at;
                    """,
                    (workout.name, workout.workout_date, workout.notes, workout_id,),
                )
                row = await cur.fetchone()
        if row is None:
            return None
        
        return Workouts(*row)
    
    async def delete_workout(self, workout_id: UUID) -> Workouts | None:
        async with pool.connection() as conn:
            async with conn.cursor as cur:
                await cur.execute(
                    """
                    DELETE FROM workouts
                    WHERE id = %s
                    RETURNING id, name, workout_date, notes, created_at, updated_at;
                    """,
                    (workout_id,),
                )
                row = await cur.fetchone()
                
        if row is None:
            return None
        
        return Workouts(*row)
                
from app.db.models.workout_exercises import WorkoutExercise
from app.schemas.workout_exercises import WorkoutExerciseCreate, WorkoutExerciseUpdate
from app.db import pool
from uuid import UUID

class WorkoutExerciseService:
    
    async def get_workout_exercises(self, workout_id: UUID) -> list[WorkoutExercise]:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    SELECT
                        id,
                        workout_id,
                        exercise_id,
                        exercise_order,
                        created_at,
                        updated_at
                    FROM workout_exercises
                    WHERE workout_id = %s
                    ORDER BY exercise_order;
                    """,
                    (workout_id,),
                )
                
                rows = await cur.fetchall()
                
        return [WorkoutExercise(*row) for row in rows]

    async def get_workout_exercise(self, workout_id: UUID, exercise_id: UUID) -> WorkoutExercise | None:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    SELECT
                        id,
                        workout_id,
                        exercise_id,
                        exercise_order,
                        created_at,
                        updated_at
                    FROM workout_exercises
                    WHERE workout_id = %s
                        AND exercise_id = %s
                    """,
                    (workout_id, exercise_id,),
                )
                
                row = await cur.fetchone()
        if row is None:
            return None
        
        return WorkoutExercise(*row)
        
    async def create_workout_exercise(self, workout_id: UUID, workout: WorkoutExerciseCreate) -> WorkoutExercise:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    INSERT INTO workout_exercises (workout_id, exercise_id, exercise_order)
                    VALUES (%s, %s, %s)
                    RETURNING id, workout_id, exercise_id, exercise_order, created_at, updated_at;
                    """,
                    (workout_id, workout.exercise_id, workout.exercise_order,),
                )
                
                row = await cur.fetchone()
        
        return WorkoutExercise(*row)
    
    async def update_workout_exercise(self, workout_id: UUID, exercise_id: UUID, workout: WorkoutExerciseUpdate) -> WorkoutExercise | None:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    UPDATE workout_exercises
                    SET
                        exercise_order = %s,
                        updated_at = NOW()
                    WHERE workout_id = %s
                        AND exercise_id = %s
                    RETURNING id, workout_id, exercise_id, exercise_order, created_at, updated_at;
                    """,
                    (workout.exercise_order, workout_id, exercise_id,),
                )
                
                row = await cur.fetchone()
        if row is None:
            return None
        
        return WorkoutExercise(*row)
    
    async def delete_workout_exercise(self, workout_id: UUID, exercise_id: UUID) -> WorkoutExercise | None:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    DELETE FROM workout_exercises
                    WHERE workout_id = %s
                     AND exercise_id = %s
                    RETURNING id, workout_id, exercise_id, exercise_order, created_at, updated_at;
                    """,
                    (workout_id, exercise_id,),
                )
                
                row = await cur.fetchone()
                
        if row is None:
            return None
        
        return WorkoutExercise(*row)
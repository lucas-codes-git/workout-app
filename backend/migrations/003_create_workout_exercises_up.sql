CREATE TABLE workout_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_id UUID NOT NULL
        REFERENCES workouts(id)
        ON DELETE CASCADE,
    exercise_id UUID NOT NULL
        REFERENCES exercises(id)
        ON DELETE CASCADE,
    exercise_order INTEGER NOT NULL
        CHECK (exercise_order > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (workout_id, exercise_id)
);

CREATE INDEX idx_workout_exercises_workout_id
ON workout_exercises (workout_id);

CREATE INDEX idx_workout_exercises_exercise_id
ON workout_exercises (exercise_id);
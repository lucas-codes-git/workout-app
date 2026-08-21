CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_exercise_id UUID NOT NULL
        REFERENCES workout_exercises(id)
        ON DELETE CASCADE,
    set_number INTEGER NOT NULL CHECK(set_number > 0),
    weight NUMERIC(6,2) NOT NULL CHECK (weight >= 0 ), -- this gives you a maximum of 9999.99
    reps INTEGER NOT NULL CHECK (reps > 0),
    rir INTEGER NOT NULL CHECK (rir >= 0),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_sets_workout_exercise_id
ON sets (workout_exercise_id, set_number);
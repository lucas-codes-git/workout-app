CREATE TABLE workouts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    workout_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_workouts_workout_date
ON workouts (workout_date DESC);
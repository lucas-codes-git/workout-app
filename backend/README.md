To start docker container

```powershell
docker compose up --build
```

To run migration files
```powershell
docker compose exec api python scripts/run_migrations.py
```

### If they were wiped you should see
```
Running 001_create_workouts_up.sql
Applied 001_create_workouts_up.sql
Running 002_create_exercises_up.sql
Applied 002_create_exercises_up.sql
Running 003_create_workout_exercises_up.sql
Applied 003_create_workout_exercises_up.sql
Running 004_create_sets_up.sql
Applied 004_create_sets_up.sql
```
### If they already exist you should see
```
Skipping '###_migration_file_name.sql'
```

To wipe dev tables
```powershell
# in the root directory 'Workout Project' run
docker exec -it workout_postgres psql -U postgres

# for this specific project
\c workout_db

# or to view a list of your databases
\l

# to connect to one of the dbs
\c your-db-name

# to view all tables in db
\dt

# you can now query your database to drop tables
# to drop all the tables
drop table exercises, schema_migrations, workout_exercises, sets, workouts CASCADE;

# to inspect the tables
\d table-name

# to quit
\q
```

opens
- http://127.0.0.1:8000

docs
- http://127.0.0.1:8000/docs

# Routes

## Workouts
```text
GET    /workouts
GET    /workouts/{workout_id}
POST   /workouts
PUT    /workouts/{workout_id}
DELETE /workouts/{workout_id}
```
## Exercises
```
GET    /exercises
POST   /exercises
PUT    /exercises/{exercise_id}
DELETE /exercises/{exercise_id}
```
## Sets
```
GET    /sets/workout-exercises/{workout_exercise_id}
POST   /sets/workout-exercises/{workout_exercise_id}
GET    /sets/{set_id}
PATCH  /sets/{set_id}
DELETE /sets/{set_id}
```
## Workout Exercises
Internal relationship resource
```
GET    /workouts/{workout_id}/exercises
GET    /workouts/{workout_id}/exercises/{exercise_id}
POST   /workouts/{workout_id}/exercises
PATCH  /workouts/{workout_id}/exercises/{exercise_id}
DELETE /workouts/{workout_id}/exercises/{exercise_id}
```

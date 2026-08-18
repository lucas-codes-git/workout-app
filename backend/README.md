To start docker container

```powershell
docker compose up --build
```

To run migration files
```powershell
 docker compose exec api python scripts/run_migrations.py
```

## TODO
Create new models for each workout endpoint
```
POST → create workout
       ↓
GET → get all workouts
       ↓
GET /{id} → get the workout
       ↓
PATCH /{id} → change only notes/name/date
       ↓
GET /{id} → verify the change
       ↓
DELETE /{id}
       ↓
GET /{id} → verify it's gone
```


opens
- http://127.0.0.1:8000

docs
- http://127.0.0.1:8000/docs

routes
```
GET    /workouts
GET    /workouts/{workout_id}
POST   /workouts
PUT    /workouts/{workout_id}
DELETE /workouts/{workout_id}
```

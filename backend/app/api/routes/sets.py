from fastapi import APIRouter, HTTPException, status
from uuid import UUID

from app.schemas.sets import SetsCreate, SetsUpdate, SetsResponse
from app.services.set_service import SetService


router = APIRouter(prefix="/sets", tags=["Sets"])

service = SetService()


@router.get("/workout-exercises/{workout_exercise_id}", response_model=list[SetsResponse], status_code=status.HTTP_200_OK)
async def get_sets(workout_exercise_id: UUID):
    return await service.get_sets(workout_exercise_id=workout_exercise_id)


@router.get("/{set_id}", response_model=SetsResponse, status_code=status.HTTP_200_OK)
async def get_set(set_id: UUID):
    workout_set = await service.get_set(set_id=set_id)

    if workout_set is None:
        raise HTTPException(status_code=404, detail="Set not found")

    return workout_set


@router.post("/workout-exercises/{workout_exercise_id}", response_model=SetsResponse, status_code=status.HTTP_201_CREATED)
async def create_set(workout_exercise_id: UUID, set_create: SetsCreate):
    return await service.create_set(set=set_create, workout_exercise_id=workout_exercise_id)


@router.patch("/{set_id}", response_model=SetsResponse, status_code=status.HTTP_200_OK)
async def update_set(set_id: UUID, set_update: SetsUpdate):
    workout_set = await service.update_set(set=set_update, set_id=set_id)

    if workout_set is None:
        raise HTTPException(status_code=404, detail="Set not found")

    return workout_set


@router.delete("/{set_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_set(set_id: UUID):
    workout_set = await service.delete_set(set_id=set_id)

    if workout_set is None:
        raise HTTPException(status_code=404, detail="Set not found")
import type { Workout } from "../types/workout";

const API_URL = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  return response.status === 204 ? (undefined as T) : response.json() as Promise<T>;
}

export const getWorkouts = () => request<Workout[]>("/workouts");
export const createWorkout = (workout: { name: string; workout_date: string; notes?: string }) => request<Workout>("/workouts", { method: "POST", body: JSON.stringify(workout) });
export const updateWorkout = (workoutId: string, workout: { name: string; workout_date: string; notes: string | null }) => request<Workout>(`/workouts/${workoutId}`, { method: "PUT", body: JSON.stringify(workout) });
export const deleteWorkout = (workoutId: string) => request<Workout>(`/workouts/${workoutId}`, { method: "DELETE" });
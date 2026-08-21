import type { WorkoutExercise } from "../types/workoutExercise";

const API_URL = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { headers: { "Content-Type": "application/json" }, ...options });
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  return response.status === 204 ? (undefined as T) : response.json() as Promise<T>;
}

export const getWorkoutExercises = (workoutId: string) => request<WorkoutExercise[]>(`/workouts/${workoutId}/exercises`);
export const addExerciseToWorkout = (workoutId: string, exerciseId: string, order: number) => request<WorkoutExercise>(`/workouts/${workoutId}/exercises`, { method: "POST", body: JSON.stringify({ exercise_id: exerciseId, exercise_order: order }) });
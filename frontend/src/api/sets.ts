import type { WorkoutSet } from "../types/set";

const API_URL = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
	const response = await fetch(`${API_URL}${path}`, { headers: { "Content-Type": "application/json" }, ...options });
	if (!response.ok) throw new Error(`API request failed (${response.status})`);
	return response.status === 204 ? (undefined as T) : response.json() as Promise<T>;
}

export const getSets = (workoutExerciseId: string) => request<WorkoutSet[]>(`/sets/workout-exercises/${workoutExerciseId}`);
export const createSet = (workoutExerciseId: string, data: { weight: number; reps: number; rir: number }) => request<WorkoutSet>(`/sets/workout-exercises/${workoutExerciseId}`, { method: "POST", body: JSON.stringify(data) });
export const deleteSet = (setId: string) => request<void>(`/sets/${setId}`, { method: "DELETE" });

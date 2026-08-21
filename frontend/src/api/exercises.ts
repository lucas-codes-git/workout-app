import type { Exercise } from "../types/exercise";

const API_URL = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
	const response = await fetch(`${API_URL}${path}`, { headers: { "Content-Type": "application/json" }, ...options });
	if (!response.ok) throw new Error(`API request failed (${response.status})`);
	return response.json() as Promise<T>;
}

export const getExercises = () => request<Exercise[]>("/exercises");
export const createExercise = (name: string) => request<Exercise>("/exercises", { method: "POST", body: JSON.stringify({ name }) });

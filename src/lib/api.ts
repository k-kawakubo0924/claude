import type { Task, SuggestionsResponse, WeatherCondition } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API error ${res.status}: ${body}`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

function withLatLon(path: string, lat?: number, lon?: number): string {
  const url = new URL(`${API_URL}${path}`);
  if (lat != null) url.searchParams.set("lat", String(lat));
  if (lon != null) url.searchParams.set("lon", String(lon));
  return url.toString();
}

export async function fetchTasks(status?: string): Promise<Task[]> {
  const url = new URL(`${API_URL}/api/tasks`);
  if (status) url.searchParams.set("status", status);
  const res = await fetch(url.toString(), { cache: "no-store" });
  return handle<Task[]>(res);
}

export async function createTask(input: {
  title: string;
  description?: string;
  priority?: string;
  category?: string;
}): Promise<Task> {
  const res = await fetch(`${API_URL}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handle<Task>(res);
}

export async function updateTask(
  id: number,
  input: Partial<Pick<Task, "title" | "description" | "status" | "priority" | "category">>,
): Promise<Task> {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handle<Task>(res);
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, { method: "DELETE" });
  return handle<void>(res);
}

export async function fetchWeather(lat?: number, lon?: number): Promise<WeatherCondition> {
  const res = await fetch(withLatLon("/api/weather", lat, lon), { cache: "no-store" });
  return handle<WeatherCondition>(res);
}

export async function fetchSuggestions(lat?: number, lon?: number): Promise<SuggestionsResponse> {
  const res = await fetch(withLatLon("/api/suggestions", lat, lon), { cache: "no-store" });
  return handle<SuggestionsResponse>(res);
}

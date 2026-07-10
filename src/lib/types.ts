export type TaskStatus = "todo" | "in_progress" | "done";
export type Priority = "low" | "medium" | "high";
export type TaskCategory = "outdoor" | "indoor" | "any";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  category: TaskCategory;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface WeatherCondition {
  code: number;
  label: string;
  emoji: string;
  temperature: number;
  wind_speed: number;
  friendly: TaskCategory;
}

export interface SuggestionsResponse {
  weather: WeatherCondition;
  suggestions: Task[];
}

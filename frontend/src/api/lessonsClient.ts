const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8001";

export interface LessonSummary {
  id: string;
  title: string;
  category: string;
  track: string;
  order: number;
  points: number;
}

export interface LessonDetail extends LessonSummary {
  question_type: "mcq" | "fill_blank";
  choices: string[];
  content: { explanation: string; example: string };
  check: { statement: string };
}

export interface LessonSubmissionResult {
  correct: boolean;
  feedback: string;
  points_awarded: number;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`Request to ${path} failed: ${res.status}`);
  }
  return res.json();
}

export function fetchLessons(category: string): Promise<LessonSummary[]> {
  return request(`/api/lessons?category=${encodeURIComponent(category)}`);
}

export function fetchLesson(id: string): Promise<LessonDetail> {
  return request(`/api/lessons/${id}`);
}

export function submitLesson(id: string, answer: string): Promise<LessonSubmissionResult> {
  return request(`/api/lessons/${id}/submit`, {
    method: "POST",
    body: JSON.stringify({ answer }),
  });
}

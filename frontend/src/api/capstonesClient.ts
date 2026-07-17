const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8001";

export interface CapstoneSummary {
  id: string;
  title: string;
  track: string;
  points_total: number;
  stage_count: number;
}

export interface CapstoneStage {
  title: string;
  stage_type: "diagnose" | "fix" | "guardrail";
  question_type: "free_text" | "fill_blank" | "mcq";
  points: number;
  context: { narrative: string; artifacts: { label: string; content: string }[] };
  choices: string[];
}

export interface CapstoneDetail {
  id: string;
  title: string;
  track: string;
  points_total: number;
  stages: CapstoneStage[];
}

export interface CapstoneStageResult {
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

export function fetchCapstones(): Promise<CapstoneSummary[]> {
  return request("/api/capstones");
}

export function fetchCapstone(id: string): Promise<CapstoneDetail> {
  return request(`/api/capstones/${id}`);
}

export function submitCapstoneStage(
  id: string,
  stageIndex: number,
  answer: string
): Promise<CapstoneStageResult> {
  return request(`/api/capstones/${id}/stages/${stageIndex}/submit`, {
    method: "POST",
    body: JSON.stringify({ answer }),
  });
}

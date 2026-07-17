const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8001";

export interface CodeOpsChallengeSummary {
  id: string;
  title: string;
  track: string;
  difficulty: string;
  points: number;
}

export interface CodeOpsChallengeDetail extends CodeOpsChallengeSummary {
  question_type: "mcq" | "fill_blank";
  choices: string[];
  problem: { statement: string; code_context: string; use_case: string };
  hint_count: number;
}

export interface CodeOpsSubmissionResult {
  correct: boolean;
  feedback: string;
  points_awarded: number;
}

export interface CodeOpsHintResponse {
  hint: string;
  hint_index: number;
  hints_remaining: number;
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

export function fetchCodeOpsChallenges(): Promise<CodeOpsChallengeSummary[]> {
  return request("/api/codeops");
}

export function fetchCodeOpsChallenge(id: string): Promise<CodeOpsChallengeDetail> {
  return request(`/api/codeops/${id}`);
}

export function submitCodeOpsChallenge(id: string, answer: string): Promise<CodeOpsSubmissionResult> {
  return request(`/api/codeops/${id}/submit`, {
    method: "POST",
    body: JSON.stringify({ answer }),
  });
}

export function fetchCodeOpsHint(id: string, hintIndex: number): Promise<CodeOpsHintResponse> {
  return request(`/api/codeops/${id}/hint`, {
    method: "POST",
    body: JSON.stringify({ hint_index: hintIndex }),
  });
}

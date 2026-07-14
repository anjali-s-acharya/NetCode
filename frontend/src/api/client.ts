const API_BASE = "http://localhost:8001";

export interface ChallengeSummary {
  id: string;
  title: string;
  track: string;
  difficulty: string;
  points: number;
}

export interface ChallengeDetail extends ChallengeSummary {
  ticket: { summary: string; reportedBy: string; priority: string };
  topology: { description: string; nodes: unknown[]; links: unknown[] };
  logs: { source: string; content: string }[];
  cli_outputs: { device: string; command: string; output: string }[];
  monitoring: { metric: string; notes: string };
  hint_count: number;
}

export interface SubmissionResult {
  correct: boolean;
  feedback: string;
  points_awarded: number;
}

export interface HintResponse {
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

export function fetchChallenges(): Promise<ChallengeSummary[]> {
  return request("/api/challenges");
}

export function fetchChallenge(id: string): Promise<ChallengeDetail> {
  return request(`/api/challenges/${id}`);
}

export function submitChallenge(
  id: string,
  rootCause: string,
  fix: string
): Promise<SubmissionResult> {
  return request(`/api/challenges/${id}/submit`, {
    method: "POST",
    body: JSON.stringify({ root_cause: rootCause, fix }),
  });
}

export function fetchHint(id: string, hintIndex: number): Promise<HintResponse> {
  return request(`/api/challenges/${id}/hint`, {
    method: "POST",
    body: JSON.stringify({ hint_index: hintIndex }),
  });
}

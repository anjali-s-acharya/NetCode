import { recordActivity } from "./streak";

const STORAGE_KEY = "codeops.progress.v1";
export const CODEOPS_PROGRESS_UPDATED_EVENT = "codeops-progress-updated";

interface ProgressState {
  solvedIds: string[];
  totalPoints: number;
}

function load(): ProgressState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { solvedIds: [], totalPoints: 0 };
  try {
    return JSON.parse(raw) as ProgressState;
  } catch {
    return { solvedIds: [], totalPoints: 0 };
  }
}

function save(state: ProgressState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getCodeOpsProgress(): ProgressState {
  return load();
}

export function isCodeOpsSolved(challengeId: string): boolean {
  return load().solvedIds.includes(challengeId);
}

export function markCodeOpsSolved(challengeId: string, points: number): ProgressState {
  const state = load();
  if (!state.solvedIds.includes(challengeId)) {
    state.solvedIds.push(challengeId);
    state.totalPoints += points;
    save(state);
    recordActivity();
    window.dispatchEvent(new Event(CODEOPS_PROGRESS_UPDATED_EVENT));
  }
  return state;
}

import { recordActivity } from "./streak";

const STORAGE_KEY = "netcode.progress.v1";
export const PROGRESS_UPDATED_EVENT = "netcode-progress-updated";

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

export function getProgress(): ProgressState {
  return load();
}

export function isSolved(challengeId: string): boolean {
  return load().solvedIds.includes(challengeId);
}

export function markSolved(challengeId: string, points: number): ProgressState {
  const state = load();
  if (!state.solvedIds.includes(challengeId)) {
    state.solvedIds.push(challengeId);
    state.totalPoints += points;
    save(state);
    recordActivity();
    window.dispatchEvent(new Event(PROGRESS_UPDATED_EVENT));
  }
  return state;
}

import { recordActivity } from "./streak";

const STORAGE_KEY = "capstone.progress.v1";
export const CAPSTONE_PROGRESS_UPDATED_EVENT = "capstone-progress-updated";

interface CapstoneProgressState {
  solvedStages: string[]; // "<capstoneId>:<stageIndex>"
  totalPoints: number;
}

function load(): CapstoneProgressState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { solvedStages: [], totalPoints: 0 };
  try {
    return JSON.parse(raw) as CapstoneProgressState;
  } catch {
    return { solvedStages: [], totalPoints: 0 };
  }
}

function save(state: CapstoneProgressState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getCapstoneProgress(): CapstoneProgressState {
  return load();
}

export function isStageSolved(capstoneId: string, stageIndex: number): boolean {
  return load().solvedStages.includes(`${capstoneId}:${stageIndex}`);
}

export function solvedStageCount(capstoneId: string): number {
  const prefix = `${capstoneId}:`;
  return load().solvedStages.filter((k) => k.startsWith(prefix)).length;
}

export function markStageSolved(capstoneId: string, stageIndex: number, points: number): void {
  const state = load();
  const key = `${capstoneId}:${stageIndex}`;
  if (!state.solvedStages.includes(key)) {
    state.solvedStages.push(key);
    state.totalPoints += points;
    save(state);
    recordActivity();
    window.dispatchEvent(new Event(CAPSTONE_PROGRESS_UPDATED_EVENT));
  }
}

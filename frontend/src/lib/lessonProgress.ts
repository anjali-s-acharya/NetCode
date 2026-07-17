import { recordActivity } from "./streak";

const STORAGE_KEY = "lessons.progress.v1";
export const LESSONS_PROGRESS_UPDATED_EVENT = "lessons-progress-updated";

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

export function getLessonProgress(): ProgressState {
  return load();
}

export function isLessonSolved(lessonId: string): boolean {
  return load().solvedIds.includes(lessonId);
}

export function markLessonSolved(lessonId: string, points: number): ProgressState {
  const state = load();
  if (!state.solvedIds.includes(lessonId)) {
    state.solvedIds.push(lessonId);
    state.totalPoints += points;
    save(state);
    recordActivity();
    window.dispatchEvent(new Event(LESSONS_PROGRESS_UPDATED_EVENT));
  }
  return state;
}

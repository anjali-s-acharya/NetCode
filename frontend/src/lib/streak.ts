const STORAGE_KEY = "streak.v1";
export const STREAK_UPDATED_EVENT = "streak-updated";

interface StreakState {
  lastActive: string; // YYYY-MM-DD
  count: number;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function load(): StreakState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { lastActive: "", count: 0 };
  try {
    return JSON.parse(raw) as StreakState;
  } catch {
    return { lastActive: "", count: 0 };
  }
}

export function getStreak(): number {
  const state = load();
  if (state.lastActive === today() || state.lastActive === yesterday()) {
    return state.count;
  }
  return 0; // streak broken (no activity yesterday or today)
}

export function recordActivity(): void {
  const state = load();
  const t = today();
  if (state.lastActive === t) return; // already counted today
  const count = state.lastActive === yesterday() ? state.count + 1 : 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ lastActive: t, count }));
  window.dispatchEvent(new Event(STREAK_UPDATED_EVENT));
}

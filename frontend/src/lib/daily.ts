export interface DailyPick {
  id: string;
  title: string;
  path: string;
}

interface Summary {
  id: string;
  title: string;
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Deterministically pick today's challenge from the combined pool. */
export function pickDaily(netcode: Summary[], codeops: Summary[]): DailyPick | null {
  const pool: DailyPick[] = [
    ...netcode.map((c) => ({ id: c.id, title: c.title, path: `/netcode/challenges/${c.id}` })),
    ...codeops.map((c) => ({ id: c.id, title: c.title, path: `/codeops/challenges/${c.id}` })),
  ];
  if (pool.length === 0) return null;
  const seed = new Date().toISOString().slice(0, 10);
  return pool[hashString(seed) % pool.length];
}

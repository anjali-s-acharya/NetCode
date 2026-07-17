const LEVEL_TITLES = [
  "Cable Monkey",
  "Console Cadet",
  "Packet Wrangler",
  "VLAN Voyager",
  "Routing Ranger",
  "Protocol Pro",
  "Script Slinger",
  "Pipeline Pilot",
  "Overlay Overlord",
  "Automation Architect",
];

// Level n requires 100·n² total XP; level 1 starts at 0.
export function levelForXp(xp: number): number {
  let level = 1;
  while (xp >= 100 * level * level) level += 1;
  return level;
}

export function xpForLevel(level: number): number {
  return level <= 1 ? 0 : 100 * (level - 1) * (level - 1);
}

export function levelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
}

export function levelProgress(xp: number): { level: number; title: string; pct: number; nextAt: number } {
  const level = levelForXp(xp);
  const base = xpForLevel(level);
  const nextAt = 100 * level * level;
  const pct = Math.min(100, Math.round(((xp - base) / (nextAt - base)) * 100));
  return { level, title: levelTitle(level), pct, nextAt };
}

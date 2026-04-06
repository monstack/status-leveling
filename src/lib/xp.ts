/**
 * XP and Level Formula
 *
 * Core mechanic:
 *   1 hour * multiplier * 10 = XP earned
 *   Default multiplier: 1.0
 *   Phase 2: deep work = 1.5, shallow work = 0.5
 *
 * Level thresholds (triangular progression):
 *   Level N requires N * (N+1) / 2 * 100 cumulative XP
 *   Level 1:  100 XP  (~10h)
 *   Level 2:  300 XP  (~30h)
 *   Level 5:  1500 XP (~150h)
 *   Level 10: 5500 XP (~550h)
 */

export const XP_PER_HOUR = 10;

export type WorkType = "deep" | "shallow" | null;

/** Convert hours + work type to XP earned */
export function hoursToXp(hours: number, workType: WorkType = null): number {
  const multiplier = workType === "deep" ? 1.5 : workType === "shallow" ? 0.5 : 1.0;
  return Math.round(hours * multiplier * XP_PER_HOUR * 10) / 10;
}

/** Total XP required to reach a given level (cumulative from level 0) */
export function xpForLevel(level: number): number {
  if (level <= 0) return 0;
  return (level * (level + 1)) / 2 * 100;
}

/** Determine current level from total XP */
export function xpToLevel(totalXp: number): number {
  if (totalXp <= 0) return 0;
  // Invert: N*(N+1)/2*100 = xp → N² + N - 2xp/100 = 0
  // N = (-1 + sqrt(1 + 8*xp/100)) / 2
  const level = Math.floor((-1 + Math.sqrt(1 + (8 * totalXp) / 100)) / 2);
  return Math.max(0, level);
}

/** XP progress within the current level (0 to xpForNextLevel) */
export function xpProgressInLevel(totalXp: number): {
  level: number;
  currentLevelXp: number;
  xpForNextLevel: number;
  progressPercent: number;
} {
  const level = xpToLevel(totalXp);
  const currentLevelStart = xpForLevel(level);
  const nextLevelStart = xpForLevel(level + 1);
  const currentLevelXp = totalXp - currentLevelStart;
  const xpForNextLevel = nextLevelStart - currentLevelStart;
  const progressPercent = Math.min(100, (currentLevelXp / xpForNextLevel) * 100);

  return { level, currentLevelXp, xpForNextLevel, progressPercent };
}

/** Character level = floor of average of all stat levels */
export function characterLevel(statXpMap: Record<string, number>): number {
  const levels = Object.values(statXpMap).map(xpToLevel);
  if (levels.length === 0) return 0;
  const avg = levels.reduce((sum, l) => sum + l, 0) / levels.length;
  return Math.floor(avg);
}

/** Format XP for display (e.g., 1500 → "1.5K") */
export function formatXp(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K`;
  return xp.toString();
}

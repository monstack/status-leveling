import type { StatSlug } from "@/lib/constants";

export interface StatCategory {
  id: string;
  slug: StatSlug;
  label: string;
  description: string | null;
  icon: string | null;
  color: string;
  sortOrder: number;
}

export interface DailyLog {
  id: string;
  userId: string;
  logDate: string; // ISO date string YYYY-MM-DD
  categoryId: string;
  categorySlug: StatSlug;
  hours: number;
  notes: string | null;
  workType: "deep" | "shallow" | null;
  createdAt: string;
  updatedAt: string;
}

export interface DailyLogEntry {
  categorySlug: StatSlug;
  hours: number;
  notes?: string;
  workType?: "deep" | "shallow" | null;
}

export interface TodayLog {
  logDate: string;
  totalHours: number;
  remainingBudget: number;
  entries: Record<StatSlug, { hours: number; notes: string | null; workType: "deep" | "shallow" | null }>;
}

export interface StatTotal {
  slug: StatSlug;
  label: string;
  totalXp: number;
  totalHours: number;
  level: number;
  progressPercent: number;
  currentLevelXp: number;
  xpForNextLevel: number;
}

export interface WeeklyAggregate {
  weekStart: string;
  byCategory: Record<StatSlug, number>; // slug → total hours that week
}

export interface DailyAggregate {
  date: string;
  totalHours: number;
  byCategory: Record<StatSlug, number>;
}

export interface Profile {
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
  timezone: string;
}

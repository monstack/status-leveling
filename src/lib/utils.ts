import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date as "Mon, Apr 5" */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

/** Format a date as "2026-04-05" (ISO local date, no timezone shift) */
export function toLocalISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Today's date as an ISO string (YYYY-MM-DD) in local time */
export function todayISO(): string {
  return toLocalISODate(new Date());
}

/** Round a number to the nearest 0.25 increment */
export function roundToQuarter(n: number): number {
  return Math.round(n * 4) / 4;
}

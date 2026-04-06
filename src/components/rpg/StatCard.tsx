"use client";

import { cn } from "@/lib/utils";
import { XpBar } from "./XpBar";
import { xpProgressInLevel, hoursToXp } from "@/lib/xp";
import type { StatSlug } from "@/lib/constants";
import { STAT_COLOR_CLASSES, STAT_BY_SLUG } from "@/lib/constants";

const STAT_ICONS: Record<StatSlug, string> = {
  physical: "🏋️",
  reading: "📚",
  technical: "💻",
};

interface StatCardProps {
  slug: StatSlug;
  totalXp: number;
  todayHours: number;
  onHoursChange: (hours: number) => void;
}

export function StatCard({ slug, totalXp, todayHours, onHoursChange }: StatCardProps) {
  const stat = STAT_BY_SLUG[slug];
  const colors = STAT_COLOR_CLASSES[slug];
  const xpProgress = xpProgressInLevel(totalXp);

  function adjust(delta: number) {
    const next = Math.max(0, Math.min(24, Math.round((todayHours + delta) * 4) / 4));
    onHoursChange(next);
  }

  return (
    <div
      className={cn(
        "relative rounded-lg border bg-card p-4 space-y-4 overflow-hidden scanlines",
        colors.border + "/30",
      )}
      style={{ "--glow-color": `var(--tw-${colors.text.replace("text-", "")}-color, #60a5fa)` } as React.CSSProperties}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">{STAT_ICONS[slug]}</span>
        <div>
          <p className={cn("text-xs font-display", colors.text)}>{stat.label.toUpperCase()}</p>
          <p className="text-xs text-muted-foreground">{stat.description}</p>
        </div>
      </div>

      {/* XP Bar */}
      <XpBar slug={slug} {...xpProgress} />

      {/* Hour input */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground flex-1">TODAY</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => adjust(-0.25)}
            className="w-7 h-7 rounded border border-border bg-background text-foreground flex items-center justify-center text-sm hover:bg-accent transition-colors"
            aria-label="Decrease 15 min"
          >
            −
          </button>
          <span className="w-14 text-center text-sm font-display tabular-nums">
            {todayHours.toFixed(2)}h
          </span>
          <button
            onClick={() => adjust(0.25)}
            className="w-7 h-7 rounded border border-border bg-background text-foreground flex items-center justify-center text-sm hover:bg-accent transition-colors"
            aria-label="Increase 15 min"
          >
            +
          </button>
        </div>
        <span className={cn("text-xs tabular-nums", colors.text)}>
          +{hoursToXp(todayHours).toFixed(0)} XP
        </span>
      </div>
    </div>
  );
}

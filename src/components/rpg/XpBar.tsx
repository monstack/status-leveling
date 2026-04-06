"use client";

import { cn } from "@/lib/utils";
import { formatXp } from "@/lib/xp";
import type { StatSlug } from "@/lib/constants";
import { STAT_COLOR_CLASSES } from "@/lib/constants";

interface XpBarProps {
  slug: StatSlug;
  level: number;
  currentLevelXp: number;
  xpForNextLevel: number;
  progressPercent: number;
  animated?: boolean;
}

export function XpBar({
  slug,
  level,
  currentLevelXp,
  xpForNextLevel,
  progressPercent,
  animated = true,
}: XpBarProps) {
  const colors = STAT_COLOR_CLASSES[slug];

  return (
    <div className="space-y-1.5">
      {/* Level badge + XP text */}
      <div className="flex items-center justify-between">
        <div className={cn("flex items-center gap-2")}>
          <span
            className={cn(
              "inline-flex items-center justify-center w-7 h-7 rounded-sm text-xs font-display border",
              colors.border,
              colors.text,
              colors.bg
            )}
          >
            {level}
          </span>
          <span className="text-xs text-muted-foreground font-display">LVL</span>
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">
          {formatXp(currentLevelXp)} / {formatXp(xpForNextLevel)} XP
        </span>
      </div>

      {/* Progress bar */}
      <div className="xp-bar-track">
        <div
          className={cn("xp-bar-fill", colors.bar, animated && "transition-none")}
          style={
            {
              "--xp-width": `${progressPercent}%`,
              width: animated ? undefined : `${progressPercent}%`,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
}

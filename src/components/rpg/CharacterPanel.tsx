"use client";

import { cn } from "@/lib/utils";
import { characterLevel, formatXp } from "@/lib/xp";
import { STAT_COLOR_CLASSES, STAT_CATEGORIES } from "@/lib/constants";
import type { StatTotal } from "@/types/app.types";

interface CharacterPanelProps {
  displayName: string | null;
  statTotals: StatTotal[];
}

export function CharacterPanel({ displayName, statTotals }: CharacterPanelProps) {
  const xpBySlug = Object.fromEntries(statTotals.map((s) => [s.slug, s.totalXp]));
  const charLevel = characterLevel(xpBySlug);
  const totalXp = statTotals.reduce((sum, s) => sum + s.totalXp, 0);

  return (
    <div className="rounded-lg border border-border bg-card p-5 flex items-center gap-5">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-14 h-14 rounded-full border-2 border-border bg-accent flex items-center justify-center text-3xl">
          ⚔️
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-xs text-foreground truncate">
            {displayName ?? "HERO"}
          </h2>
          <span className="flex-shrink-0 px-2 py-0.5 rounded-sm border border-yellow-500/50 bg-yellow-500/10 text-yellow-400 text-xs font-display">
            LVL {charLevel}
          </span>
        </div>
        <p className="text-xs text-muted-foreground tabular-nums">
          {formatXp(totalXp)} total XP across all stats
        </p>

        {/* Per-stat level pills */}
        <div className="flex gap-2 flex-wrap">
          {STAT_CATEGORIES.map((cat) => {
            const stat = statTotals.find((s) => s.slug === cat.slug);
            const colors = STAT_COLOR_CLASSES[cat.slug];
            return (
              <span
                key={cat.slug}
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-display border",
                  colors.border + "/40",
                  colors.text,
                  colors.bg
                )}
              >
                {cat.slug.slice(0, 3).toUpperCase()} {stat?.level ?? 0}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

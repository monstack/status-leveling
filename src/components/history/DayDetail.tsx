"use client";

import { useTodayLog } from "@/hooks/useDailyLog";
import { STAT_CATEGORIES, STAT_COLOR_CLASSES } from "@/lib/constants";
import { hoursToXp } from "@/lib/xp";
import { formatDate, cn } from "@/lib/utils";
import type { StatSlug } from "@/lib/constants";

interface DayDetailProps {
  date: string;
  onClose: () => void;
}

export function DayDetail({ date, onClose }: DayDetailProps) {
  const { data: log, isLoading } = useTodayLog(date);

  return (
    <div
      className="fixed inset-0 z-40 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-xl md:rounded-xl border border-border bg-card p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xs text-foreground">{formatDate(date).toUpperCase()}</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors text-lg"
          >
            ×
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-12 rounded shimmer" />)}
          </div>
        ) : !log || log.totalHours === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No hours logged this day.</p>
        ) : (
          <div className="space-y-3">
            {STAT_CATEGORIES.map((cat) => {
              const entry = (log.entries as Record<StatSlug, { hours: number } | undefined>)[cat.slug];
              const hours = entry?.hours ?? 0;
              if (hours === 0) return null;
              const colors = STAT_COLOR_CLASSES[cat.slug];
              return (
                <div key={cat.slug} className="flex items-center gap-3">
                  <div className={cn("w-2 h-8 rounded-full", colors.bar)} />
                  <div className="flex-1">
                    <p className={cn("text-xs font-display", colors.text)}>{cat.label.toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground">{hours.toFixed(2)}h</p>
                  </div>
                  <span className={cn("text-xs tabular-nums", colors.text)}>
                    +{hoursToXp(hours).toFixed(0)} XP
                  </span>
                </div>
              );
            })}

            <div className="border-t border-border pt-3 flex justify-between text-xs text-muted-foreground">
              <span>Total</span>
              <span className="text-foreground tabular-nums">{log.totalHours.toFixed(2)}h</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { DAILY_BUDGET } from "@/lib/constants";

interface BudgetMeterProps {
  totalHours: number;
}

export function BudgetMeter({ totalHours }: BudgetMeterProps) {
  const remaining = DAILY_BUDGET - totalHours;
  const usedPercent = Math.min(100, (totalHours / DAILY_BUDGET) * 100);
  const isOver = remaining < 0;
  const isFull = remaining === 0;

  const barColor =
    usedPercent < 50
      ? "bg-emerald-500"
      : usedPercent < 75
      ? "bg-yellow-400"
      : usedPercent < 100
      ? "bg-orange-400"
      : "bg-red-500";

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-display text-muted-foreground">DAILY BUDGET</span>
        <span
          className={cn(
            "text-xs font-display tabular-nums",
            isFull && "text-emerald-400",
            isOver && "text-red-400",
            !isFull && !isOver && "text-foreground"
          )}
        >
          {isFull
            ? "FULL ✓"
            : isOver
            ? `+${Math.abs(remaining).toFixed(1)}h OVER`
            : `${remaining.toFixed(1)}h LEFT`}
        </span>
      </div>

      {/* Bar */}
      <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", barColor)}
          style={{ width: `${Math.min(100, usedPercent)}%` }}
        />
      </div>

      {/* Hour markers */}
      <div className="flex justify-between text-[10px] text-muted-foreground/60 tabular-nums">
        <span>0h</span>
        <span>{totalHours.toFixed(1)}h used</span>
        <span>{DAILY_BUDGET}h</span>
      </div>

      {isOver && (
        <p className="text-xs text-red-400 text-center">
          Over budget by {Math.abs(remaining).toFixed(1)}h — consider adjusting your entries.
        </p>
      )}
    </div>
  );
}

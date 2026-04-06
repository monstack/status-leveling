"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useHistory, type HistoryDay } from "@/hooks/useHistory";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay(); // 0=Sun
}

function hoursToGlow(hours: number) {
  if (hours === 0) return "bg-white/5 border-white/10";
  if (hours < 4)   return "bg-emerald-500/10 border-emerald-500/20";
  if (hours < 8)   return "bg-emerald-500/20 border-emerald-500/40";
  if (hours < 16)  return "bg-emerald-500/40 border-emerald-500/60";
  return "bg-emerald-500/60 border-emerald-500/80";
}

interface CalendarViewProps {
  onDaySelect: (date: string) => void;
  selectedDate?: string;
}

export function CalendarView({ onDaySelect, selectedDate }: CalendarViewProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { data: historyDays, isLoading } = useHistory(year, month);

  const dayMap: Record<string, HistoryDay> = {};
  for (const d of historyDays ?? []) {
    dayMap[d.date] = d;
  }

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="space-y-4">
      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="p-2 hover:bg-accent rounded-md transition-colors">‹</button>
        <span className="font-display text-xs text-foreground">{monthLabel.toUpperCase()}</span>
        <button onClick={nextMonth} className="p-2 hover:bg-accent rounded-md transition-colors">›</button>
      </div>

      {/* Day of week headers */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-[10px] font-display text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      {/* Day grid */}
      {isLoading ? (
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="aspect-square rounded shimmer" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} />;

            const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const histDay = dayMap[dateStr];
            const hours = histDay?.totalHours ?? 0;
            const isSelected = selectedDate === dateStr;
            const isToday = dateStr === new Date().toISOString().split("T")[0];

            return (
              <button
                key={dateStr}
                onClick={() => onDaySelect(dateStr)}
                className={cn(
                  "aspect-square rounded border text-xs flex flex-col items-center justify-center gap-0.5 transition-all hover:scale-105",
                  hoursToGlow(hours),
                  isSelected && "ring-2 ring-foreground/50",
                  isToday && "ring-1 ring-yellow-400/70"
                )}
              >
                <span className="font-display text-[9px] text-foreground/70">{day}</span>
                {hours > 0 && (
                  <span className="text-[8px] text-emerald-400">{hours.toFixed(0)}h</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
        <span>Less</span>
        {[0, 4, 8, 16].map((h) => (
          <div key={h} className={cn("w-3 h-3 rounded-sm border", hoursToGlow(h === 0 ? 0 : h))} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

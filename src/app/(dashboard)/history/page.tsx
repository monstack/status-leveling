"use client";

import { useState } from "react";
import { CalendarView } from "@/components/history/CalendarView";
import { DayDetail } from "@/components/history/DayDetail";

export default function HistoryPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="font-display text-xs text-muted-foreground">HISTORY</h1>
        <p className="text-sm text-foreground mt-1">Your logged days</p>
      </div>

      <CalendarView
        onDaySelect={(date) => setSelectedDate(date)}
        selectedDate={selectedDate ?? undefined}
      />

      {selectedDate && (
        <DayDetail date={selectedDate} onClose={() => setSelectedDate(null)} />
      )}
    </div>
  );
}

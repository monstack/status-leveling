"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { todayISO } from "@/lib/utils";
import type { StatSlug } from "@/lib/constants";
import type { TodayLog } from "@/types/app.types";

export function useTodayLog(date?: string) {
  const logDate = date ?? todayISO();

  return useQuery<TodayLog>({
    queryKey: ["logs", logDate],
    queryFn: async () => {
      const res = await fetch(`/api/logs?date=${logDate}`);
      if (!res.ok) throw new Error("Failed to fetch today's log");
      return res.json();
    },
  });
}

interface LogEntry {
  categorySlug: StatSlug;
  hours: number;
  notes?: string | null;
}

export function useSaveDailyLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      date,
      entries,
    }: {
      date?: string;
      entries: LogEntry[];
    }) => {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: date ?? todayISO(), entries }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save log");
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      const logDate = variables.date ?? todayISO();
      queryClient.invalidateQueries({ queryKey: ["logs", logDate] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";
import type { StatSlug } from "@/lib/constants";

export interface HistoryDay {
  date: string;
  totalHours: number;
  byCategory: Record<StatSlug, number>;
}

export function useHistory(year: number, month: number) {
  return useQuery<HistoryDay[]>({
    queryKey: ["history", year, month],
    queryFn: async () => {
      // Calculate date range for the given month
      const start = `${year}-${String(month).padStart(2, "0")}-01`;
      const end = new Date(year, month, 0).toISOString().split("T")[0];

      const res = await fetch(`/api/stats?range=all&from=${start}&to=${end}`);
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();
      return data.daily as HistoryDay[];
    },
  });
}

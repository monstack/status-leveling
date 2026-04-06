"use client";

import { useQuery } from "@tanstack/react-query";
import { xpProgressInLevel } from "@/lib/xp";
import type { StatSlug } from "@/lib/constants";
import type { StatTotal } from "@/types/app.types";

interface StatsResponse {
  statTotals: Array<{
    slug: StatSlug;
    label: string;
    totalHours: number;
    totalXp: number;
  }>;
  daily: Array<{
    date: string;
    byCategory: Record<StatSlug, number>;
  }>;
}

export function useStats(range: "week" | "month" | "all" = "all") {
  return useQuery<StatsResponse & { enrichedTotals: StatTotal[] }>({
    queryKey: ["stats", range],
    queryFn: async () => {
      const res = await fetch(`/api/stats?range=${range}`);
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data: StatsResponse = await res.json();

      const enrichedTotals: StatTotal[] = data.statTotals.map((s) => {
        const { level, currentLevelXp, xpForNextLevel, progressPercent } =
          xpProgressInLevel(s.totalXp);
        return { ...s, level, currentLevelXp, xpForNextLevel, progressPercent };
      });

      return { ...data, enrichedTotals };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

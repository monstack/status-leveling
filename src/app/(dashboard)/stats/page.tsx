"use client";

import { useState } from "react";
import { useStats } from "@/hooks/useStats";
import { STAT_COLOR_CLASSES, STAT_CATEGORIES } from "@/lib/constants";
import { formatXp } from "@/lib/xp";
import { cn } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area,
} from "recharts";

type Range = "week" | "month" | "all";

const RANGE_LABELS: Record<Range, string> = {
  week: "7 DAYS",
  month: "30 DAYS",
  all: "ALL TIME",
};

export default function StatsPage() {
  const [range, setRange] = useState<Range>("week");
  const { data, isLoading } = useStats(range);

  const chartColors = {
    physical: "#10b981",
    reading: "#f59e0b",
    technical: "#3b82f6",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-xs text-muted-foreground">STATS</h1>
          <p className="text-sm text-foreground mt-1">Your progress over time</p>
        </div>

        {/* Range selector */}
        <div className="flex gap-1 p-1 rounded-md border border-border bg-card">
          {(Object.keys(RANGE_LABELS) as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "px-2 py-1 rounded text-[10px] font-display transition-colors",
                range === r ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      {/* Stat summary cards */}
      {isLoading ? (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-lg shimmer" />)}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {STAT_CATEGORIES.map((cat) => {
            const stat = data?.enrichedTotals.find((s) => s.slug === cat.slug);
            const colors = STAT_COLOR_CLASSES[cat.slug];
            return (
              <div
                key={cat.slug}
                className={cn("rounded-lg border p-4 space-y-2 bg-card", colors.border + "/30")}
              >
                <p className={cn("text-[10px] font-display", colors.text)}>
                  {cat.slug.toUpperCase()}
                </p>
                <p className="text-2xl font-display text-foreground">{stat?.level ?? 0}</p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {formatXp(stat?.totalXp ?? 0)} XP
                </p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {(stat?.totalHours ?? 0).toFixed(1)}h total
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Daily hours bar chart */}
      {!isLoading && data && data.daily.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <h2 className="font-display text-[10px] text-muted-foreground">HOURS PER DAY</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.daily} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 9, fill: "#64748b" }}
                tickFormatter={(d) => d.slice(5)} // MM-DD
              />
              <YAxis tick={{ fontSize: 9, fill: "#64748b" }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(222 47% 9%)",
                  border: "1px solid hsl(217 32% 18%)",
                  borderRadius: 6,
                  fontSize: 11,
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 10, paddingTop: 8 }}
                formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
              />
              {STAT_CATEGORIES.map((cat) => (
                <Bar
                  key={cat.slug}
                  dataKey={`byCategory.${cat.slug}`}
                  name={cat.slug}
                  stackId="a"
                  fill={chartColors[cat.slug]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Cumulative XP area chart */}
      {!isLoading && data && data.daily.length > 1 && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <h2 className="font-display text-[10px] text-muted-foreground">CUMULATIVE HOURS</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={data.daily.reduce<Array<Record<string, number | string>>>((acc, day) => {
                const prev = acc[acc.length - 1] ?? {};
                acc.push({
                  date: day.date,
                  physical: ((prev.physical as number) ?? 0) + (day.byCategory.physical ?? 0),
                  reading: ((prev.reading as number) ?? 0) + (day.byCategory.reading ?? 0),
                  technical: ((prev.technical as number) ?? 0) + (day.byCategory.technical ?? 0),
                });
                return acc;
              }, [])}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#64748b" }} tickFormatter={(d) => d.slice(5)} />
              <YAxis tick={{ fontSize: 9, fill: "#64748b" }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(222 47% 9%)",
                  border: "1px solid hsl(217 32% 18%)",
                  borderRadius: 6,
                  fontSize: 11,
                }}
              />
              {STAT_CATEGORIES.map((cat, i) => (
                <Area
                  key={cat.slug}
                  type="monotone"
                  dataKey={cat.slug}
                  stackId="1"
                  stroke={chartColors[cat.slug]}
                  fill={chartColors[cat.slug]}
                  fillOpacity={0.2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {!isLoading && (!data || data.daily.length === 0) && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No data yet. Start logging daily to see your stats here.
        </div>
      )}
    </div>
  );
}

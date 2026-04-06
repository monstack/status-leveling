import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { hoursToXp } from "@/lib/xp";
import type { StatSlug } from "@/lib/constants";

interface LogRow {
  log_date: string;
  hours: number;
  work_type: "deep" | "shallow" | null;
  stat_categories: { slug: string; label: string; color: string; sort_order: number } | null;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") ?? "all";
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  let fromDate: string | undefined;
  const now = new Date();

  if (fromParam) {
    fromDate = fromParam;
  } else if (range === "week") {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    fromDate = d.toISOString().split("T")[0];
  } else if (range === "month") {
    const d = new Date(now);
    d.setMonth(d.getMonth() - 1);
    fromDate = d.toISOString().split("T")[0];
  }

  let query = supabase
    .from("daily_logs")
    .select("log_date, hours, work_type, stat_categories(slug, label, color, sort_order)")
    .eq("user_id", user.id)
    .order("log_date", { ascending: true });

  if (fromDate) query = query.gte("log_date", fromDate);
  if (toParam)  query = query.lte("log_date", toParam);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const logs = (data ?? []) as unknown as LogRow[];

  const totalsBySlug: Record<string, { hours: number; label: string; color: string; sortOrder: number }> = {};
  const dailyMap: Record<string, Record<string, number>> = {};

  for (const log of logs) {
    const cat = log.stat_categories;
    if (!cat) continue;
    const slug = cat.slug;

    if (!totalsBySlug[slug]) {
      totalsBySlug[slug] = { hours: 0, label: cat.label, color: cat.color, sortOrder: cat.sort_order };
    }
    totalsBySlug[slug].hours += log.hours;

    if (!dailyMap[log.log_date]) dailyMap[log.log_date] = {};
    dailyMap[log.log_date][slug] = (dailyMap[log.log_date][slug] ?? 0) + log.hours;
  }

  const statTotals = Object.entries(totalsBySlug)
    .sort((a, b) => a[1].sortOrder - b[1].sortOrder)
    .map(([slug, data]) => ({
      slug: slug as StatSlug,
      label: data.label,
      totalHours: data.hours,
      totalXp: hoursToXp(data.hours),
    }));

  const daily = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, byCategory]) => ({ date, byCategory }));

  return NextResponse.json({ statTotals, daily });
}

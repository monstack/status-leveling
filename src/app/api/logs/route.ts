import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { todayISO } from "@/lib/utils";
import type { StatSlug } from "@/lib/constants";

interface LogRow {
  id: string;
  user_id: string;
  log_date: string;
  category_id: string;
  hours: number;
  notes: string | null;
  work_type: "deep" | "shallow" | null;
  stat_categories: { slug: string; label: string; color: string } | null;
}

interface CategoryRow {
  id: string;
  slug: string;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? todayISO();

  const { data, error } = await supabase
    .from("daily_logs")
    .select("*, stat_categories(slug, label, color)")
    .eq("user_id", user.id)
    .eq("log_date", date);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const logs = (data ?? []) as unknown as LogRow[];

  const entries: Record<string, { hours: number; notes: string | null; workType: string | null }> = {};
  let totalHours = 0;

  for (const log of logs) {
    const slug = log.stat_categories?.slug;
    if (slug) {
      entries[slug] = { hours: log.hours, notes: log.notes, workType: log.work_type };
      totalHours += log.hours;
    }
  }

  return NextResponse.json({
    logDate: date,
    totalHours,
    remainingBudget: 24 - totalHours,
    entries,
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { date, entries } = body as {
    date?: string;
    entries: Array<{ categorySlug: StatSlug; hours: number; notes?: string | null }>;
  };

  const logDate = date ?? todayISO();

  const { data, error: catError } = await supabase
    .from("stat_categories")
    .select("id, slug");

  if (catError) return NextResponse.json({ error: catError.message }, { status: 500 });

  const categories = (data ?? []) as unknown as CategoryRow[];
  const categoryIdBySlug = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  const rows = entries
    .filter((e) => e.categorySlug && categoryIdBySlug[e.categorySlug])
    .map((e) => ({
      user_id: user.id,
      log_date: logDate,
      category_id: categoryIdBySlug[e.categorySlug],
      hours: Math.max(0, Math.min(24, e.hours)),
      notes: e.notes ?? null,
    }));

  const { error } = await supabase
    .from("daily_logs")
    .upsert(rows as never[], { onConflict: "user_id,log_date,category_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, logDate, count: rows.length });
}

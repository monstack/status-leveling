"use client";

import { useState, useCallback } from "react";
import { StatCard } from "./StatCard";
import { BudgetMeter } from "./BudgetMeter";
import { LevelUpToast } from "./LevelUpToast";
import { useTodayLog, useSaveDailyLog } from "@/hooks/useDailyLog";
import { useStats } from "@/hooks/useStats";
import { STAT_CATEGORIES, DAILY_BUDGET } from "@/lib/constants";
import type { StatSlug } from "@/lib/constants";
import { xpToLevel, hoursToXp } from "@/lib/xp";
import { toast } from "sonner";

export function DailyLogForm() {
  const { data: todayLog, isLoading } = useTodayLog();
  const { data: statsData } = useStats("all");
  const saveMutation = useSaveDailyLog();

  // Local draft hours (before saving)
  const [draft, setDraft] = useState<Record<StatSlug, number>>({
    physical: 0,
    reading: 0,
    technical: 0,
  });
  const [initialized, setInitialized] = useState(false);
  const [showOverBudgetDialog, setShowOverBudgetDialog] = useState(false);
  const [levelUp, setLevelUp] = useState<{ slug: StatSlug; newLevel: number } | null>(null);

  // Initialize draft from server data once loaded
  if (todayLog && !initialized) {
    const entries = todayLog.entries as Record<StatSlug, { hours: number } | undefined>;
    setDraft({
      physical: entries.physical?.hours ?? 0,
      reading: entries.reading?.hours ?? 0,
      technical: entries.technical?.hours ?? 0,
    });
    setInitialized(true);
  }

  const totalDraftHours = Object.values(draft).reduce((s, h) => s + h, 0);

  function updateSlug(slug: StatSlug, hours: number) {
    setDraft((prev) => ({ ...prev, [slug]: hours }));
  }

  async function handleSave(force = false) {
    if (totalDraftHours > DAILY_BUDGET && !force) {
      setShowOverBudgetDialog(true);
      return;
    }

    const entries = STAT_CATEGORIES.map((cat) => ({
      categorySlug: cat.slug,
      hours: draft[cat.slug],
    }));

    // Check for level-ups
    const prevLevels: Record<StatSlug, number> = {
      physical: xpToLevel(statsData?.enrichedTotals.find(s => s.slug === "physical")?.totalXp ?? 0),
      reading: xpToLevel(statsData?.enrichedTotals.find(s => s.slug === "reading")?.totalXp ?? 0),
      technical: xpToLevel(statsData?.enrichedTotals.find(s => s.slug === "technical")?.totalXp ?? 0),
    };

    try {
      await saveMutation.mutateAsync({ entries });
      toast.success("Log saved! XP awarded.");

      // Detect level-up (naive: check if new XP crosses a threshold)
      for (const cat of STAT_CATEGORIES) {
        const currentXp = statsData?.enrichedTotals.find(s => s.slug === cat.slug)?.totalXp ?? 0;
        const addedXp = hoursToXp(draft[cat.slug]);
        const newLevel = xpToLevel(currentXp + addedXp);
        if (newLevel > prevLevels[cat.slug]) {
          setLevelUp({ slug: cat.slug, newLevel });
          break; // Show one level-up at a time
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-36 rounded-lg shimmer" />
        ))}
      </div>
    );
  }

  return (
    <>
      {levelUp && (
        <LevelUpToast
          slug={levelUp.slug}
          newLevel={levelUp.newLevel}
          onDismiss={() => setLevelUp(null)}
        />
      )}

      {showOverBudgetDialog && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-lg border border-border bg-card p-6 space-y-4 max-w-sm mx-4">
            <h3 className="font-display text-xs text-foreground">OVER BUDGET</h3>
            <p className="text-sm text-muted-foreground">
              You've logged <strong className="text-foreground">{totalDraftHours.toFixed(1)}h</strong>,
              which exceeds the 24-point daily budget. Save anyway?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowOverBudgetDialog(false)}
                className="flex-1 rounded-md border border-border py-2 text-xs font-display hover:bg-accent transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={() => { setShowOverBudgetDialog(false); handleSave(true); }}
                className="flex-1 rounded-md bg-primary text-primary-foreground py-2 text-xs font-display hover:opacity-90 transition-opacity"
              >
                SAVE ANYWAY
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <BudgetMeter totalHours={totalDraftHours} />

        <div className="grid gap-4 md:grid-cols-3">
          {STAT_CATEGORIES.map((cat) => {
            const statTotal = statsData?.enrichedTotals.find((s) => s.slug === cat.slug);
            return (
              <StatCard
                key={cat.slug}
                slug={cat.slug}
                totalXp={statTotal?.totalXp ?? 0}
                todayHours={draft[cat.slug]}
                onHoursChange={(h) => updateSlug(cat.slug, h)}
              />
            );
          })}
        </div>

        <button
          onClick={() => handleSave()}
          disabled={saveMutation.isPending}
          className="w-full rounded-md bg-primary text-primary-foreground py-3 text-xs font-display disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          {saveMutation.isPending ? "SAVING..." : "SAVE TODAY'S LOG"}
        </button>
      </div>
    </>
  );
}

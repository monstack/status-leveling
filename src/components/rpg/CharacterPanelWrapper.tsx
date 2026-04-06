"use client";

import { CharacterPanel } from "./CharacterPanel";
import { useStats } from "@/hooks/useStats";
import { useAuth } from "@/hooks/useAuth";

export function CharacterPanelWrapper() {
  const { data: statsData, isLoading } = useStats("all");
  const { user } = useAuth();

  if (isLoading) {
    return <div className="h-28 rounded-lg shimmer" />;
  }

  return (
    <CharacterPanel
      displayName={user?.email?.split("@")[0] ?? null}
      statTotals={statsData?.enrichedTotals ?? []}
    />
  );
}

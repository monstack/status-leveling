"use client";

import { useEffect, useRef } from "react";
import { STAT_COLOR_CLASSES, STAT_BY_SLUG } from "@/lib/constants";
import type { StatSlug } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LevelUpToastProps {
  slug: StatSlug;
  newLevel: number;
  onDismiss: () => void;
}

export function LevelUpToast({ slug, newLevel, onDismiss }: LevelUpToastProps) {
  const fired = useRef(false);
  const colors = STAT_COLOR_CLASSES[slug];
  const stat = STAT_BY_SLUG[slug];

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    // Dynamic import to avoid SSR issues
    import("canvas-confetti").then((confetti) => {
      confetti.default({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#10b981", "#f59e0b", "#3b82f6", "#ffffff"],
      });
    });

    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onDismiss}
    >
      <div className="level-up-enter text-center space-y-4 px-8">
        <div className="text-6xl">⬆️</div>
        <div className={cn("font-display text-2xl", colors.text)}>LEVEL UP!</div>
        <div className="font-display text-sm text-foreground">
          {stat.label}
        </div>
        <div
          className={cn(
            "inline-flex items-center justify-center w-20 h-20 rounded-lg border-2 font-display text-4xl",
            colors.border,
            colors.text,
            colors.bg
          )}
        >
          {newLevel}
        </div>
        <p className="text-xs text-muted-foreground">tap to dismiss</p>
      </div>
    </div>
  );
}

export const DAILY_BUDGET = 24;

export const STAT_CATEGORIES = [
  {
    slug: "physical",
    label: "Physical Status",
    description: "Fitness, exercise, and health activities",
    icon: "physical",
    color: "emerald",
    tailwindColor: "physical",
    hex: "#10b981",
    glowHex: "#34d399",
  },
  {
    slug: "reading",
    label: "Reading Status",
    description: "Books, literature, and study sessions",
    icon: "reading",
    color: "amber",
    tailwindColor: "reading",
    hex: "#f59e0b",
    glowHex: "#fbbf24",
  },
  {
    slug: "technical",
    label: "Technical Status",
    description: "Coding, cloud, DevOps, and engineering",
    icon: "technical",
    color: "blue",
    tailwindColor: "technical",
    hex: "#3b82f6",
    glowHex: "#60a5fa",
  },
] as const;

export type StatSlug = (typeof STAT_CATEGORIES)[number]["slug"];

export const STAT_BY_SLUG = Object.fromEntries(
  STAT_CATEGORIES.map((s) => [s.slug, s])
) as Record<StatSlug, (typeof STAT_CATEGORIES)[number]>;

/** Bar color classes per stat slug */
export const STAT_COLOR_CLASSES: Record<StatSlug, { bar: string; text: string; border: string; bg: string }> = {
  physical: {
    bar: "bg-physical",
    text: "text-physical",
    border: "border-physical",
    bg: "bg-physical/10",
  },
  reading: {
    bar: "bg-reading",
    text: "text-reading",
    border: "border-reading",
    bg: "bg-reading/10",
  },
  technical: {
    bar: "bg-technical",
    text: "text-technical",
    border: "border-technical",
    bg: "bg-technical/10",
  },
};

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "LOG",     icon: "⚔️" },
  { href: "/history",   label: "HISTORY", icon: "📜" },
  { href: "/stats",     label: "STATS",   icon: "🔮" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card/95 backdrop-blur-sm">
      <div className="flex">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[56px] transition-colors",
                active ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={cn("font-display text-[8px]", active && "text-foreground")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

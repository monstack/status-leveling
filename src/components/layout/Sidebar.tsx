"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "DASHBOARD", icon: "⚔️", description: "Log your daily stats" },
  { href: "/history",   label: "HISTORY",   icon: "📜", description: "View past entries" },
  { href: "/stats",     label: "STATS",     icon: "🔮", description: "Charts and trends" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside className="w-56 flex-shrink-0 border-r border-border bg-card flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="p-5 border-b border-border">
        <p className="font-display text-[10px] text-muted-foreground leading-relaxed">
          STATUS<br />
          <span className="text-foreground">LEVELING</span>
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
                active
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-display text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-border space-y-2">
        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        <button
          onClick={signOut}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}

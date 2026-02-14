// Navigation mobile (bottom bar)
// Affichee uniquement sur mobile, remplace la sidebar

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Globe, Bell, Settings } from "lucide-react";

const navItems = [
  {
    label: "Accueil",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Sites",
    href: "/dashboard/sites",
    icon: Globe,
  },
  {
    label: "Alertes",
    href: "/dashboard/alerts",
    icon: Bell,
  },
  {
    label: "Reglages",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

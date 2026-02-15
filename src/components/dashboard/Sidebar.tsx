// Sidebar du dashboard (desktop uniquement)
// Navigation principale + info plan + logo

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { APP_CONFIG } from "@/config/app";
import { Button } from "@/components/ui/button";
import {
  Shield,
  ShieldCheck,
  LayoutDashboard,
  Globe,
  Bell,
  FileText,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  CreditCard,
} from "lucide-react";

const navItems = [
  {
    label: "Tableau de bord",
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
    label: "Rapports",
    href: "/dashboard/reports",
    icon: FileText,
  },
];

const bottomItems = [
  {
    label: "Parametres",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    label: "Abonnement",
    href: "/dashboard/settings/billing",
    icon: CreditCard,
  },
];

interface SidebarProps {
  user: User;
  isAdmin?: boolean;
}

export function Sidebar({ user, isAdmin }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-indigo-600" />
            <span className="font-bold">{APP_CONFIG.name}</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <Shield className="h-6 w-6 text-indigo-600" />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", collapsed && "hidden")}
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Bouton expand (quand collapsed) */}
      {collapsed && (
        <Button
          variant="ghost"
          size="icon"
          className="mx-auto mt-2 h-8 w-8"
          onClick={() => setCollapsed(false)}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      )}

      {/* Navigation principale */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Navigation basse */}
      <div className="border-t p-2">
        {isAdmin && (
          <Link
            href="/dashboard/admin"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              pathname.startsWith("/dashboard/admin")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? "Admin" : undefined}
          >
            <ShieldCheck className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Admin</span>}
          </Link>
        )}
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

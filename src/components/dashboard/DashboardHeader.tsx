// Header du dashboard
// Titre de la page, toggle theme, notifications, avatar utilisateur

"use client";

import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Moon, Sun, LogOut, Settings, User as UserIcon } from "lucide-react";
import { useTheme } from "next-themes";

// Titres des pages selon le pathname
const pageTitles: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/dashboard/sites": "Mes sites",
  "/dashboard/alerts": "Alertes",
  "/dashboard/reports": "Rapports",
  "/dashboard/settings": "Parametres",
  "/dashboard/settings/billing": "Abonnement",
  "/dashboard/settings/notifications": "Notifications",
};

interface DashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Trouver le titre le plus specifique
  const title =
    pageTitles[pathname] ||
    Object.entries(pageTitles)
      .filter(([path]) => pathname.startsWith(path))
      .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ||
    "Dashboard";

  const initials = user.user_metadata?.name
    ? user.user_metadata.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : user.email?.[0]?.toUpperCase() || "U";

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
      <h1 className="text-lg font-semibold md:text-xl">{title}</h1>

      <div className="flex items-center gap-2">
        {/* Toggle theme */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Changer le theme</span>
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/alerts")}
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* Menu utilisateur */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={user.user_metadata?.avatar_url}
                  alt={user.user_metadata?.name || "Avatar"}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">
                {user.user_metadata?.name || "Utilisateur"}
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
              <UserIcon className="mr-2 h-4 w-4" />
              Mon compte
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings/billing")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Abonnement
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Se deconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

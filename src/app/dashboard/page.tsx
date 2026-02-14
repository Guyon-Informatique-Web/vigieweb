// Page principale du dashboard
// Vue d'ensemble : stats, liste des sites, alertes recentes

import type { Metadata } from "next";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteCard } from "@/components/dashboard/SiteCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Globe, ArrowUp, ArrowDown, Bell, Plus, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import type { SiteStatus } from "@/types/site";
import type { Severity as SeverityType } from "@/types/alert";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

const severityColors: Record<SeverityType, string> = {
  INFO: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  WARNING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  CRITICAL: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default async function DashboardPage() {
  const { user, error } = await getAuthUser();
  if (error) redirect("/login");

  // Charger les sites et les alertes en parallele
  const [sites, unreadAlertCount, recentAlerts] = await Promise.all([
    prisma.site.findMany({
      where: { userId: user!.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.alert.count({
      where: { userId: user!.id, isRead: false },
    }),
    prisma.alert.findMany({
      where: { userId: user!.id },
      include: { site: { select: { name: true, url: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const sitesUp = sites.filter((s) => s.currentStatus === "UP").length;
  const sitesDown = sites.filter((s) => s.currentStatus === "DOWN").length;

  const stats = [
    {
      title: "Sites surveilles",
      value: sites.length.toString(),
      icon: Globe,
      color: "text-indigo-600",
    },
    {
      title: "Sites en ligne",
      value: sitesUp.toString(),
      icon: ArrowUp,
      color: "text-emerald-600",
    },
    {
      title: "Sites hors ligne",
      value: sitesDown.toString(),
      icon: ArrowDown,
      color: "text-red-600",
    },
    {
      title: "Alertes non lues",
      value: unreadAlertCount.toString(),
      icon: Bell,
      color: "text-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Barre de stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contenu principal */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sites */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Mes sites</CardTitle>
            <Link href="/dashboard/sites/add">
              <Button size="sm">
                <Plus className="mr-1 h-4 w-4" />
                Ajouter
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {sites.length === 0 ? (
              <EmptyState
                icon={Globe}
                title="Aucun site surveille"
                description="Ajoutez votre premier site pour commencer le monitoring."
              />
            ) : (
              <div className="space-y-3">
                {sites.slice(0, 5).map((site) => (
                  <Link
                    key={site.id}
                    href={`/dashboard/sites/${site.id}`}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{site.name}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {site.url}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {site.uptimePercentage != null && (
                        <span className="text-sm text-muted-foreground">
                          {site.uptimePercentage.toFixed(1)}%
                        </span>
                      )}
                      <StatusBadge status={site.currentStatus as SiteStatus} />
                    </div>
                  </Link>
                ))}
                {sites.length > 5 && (
                  <Link href="/dashboard/sites">
                    <Button variant="ghost" size="sm" className="w-full">
                      Voir tous les sites ({sites.length})
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alertes recentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Alertes recentes</CardTitle>
            {recentAlerts.length > 0 && (
              <Link href="/dashboard/alerts">
                <Button variant="ghost" size="sm">
                  Voir tout
                </Button>
              </Link>
            )}
          </CardHeader>
          <CardContent>
            {recentAlerts.length === 0 ? (
              <EmptyState
                icon={Bell}
                title="Aucune alerte"
                description="Les alertes apparaitront ici quand un probleme sera detecte."
              />
            ) : (
              <div className="space-y-2">
                {recentAlerts.map((alert) => (
                  <Link
                    key={alert.id}
                    href={`/dashboard/sites/${alert.siteId}`}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      {!alert.isRead && (
                        <div className="h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                      )}
                      <Badge
                        className={
                          severityColors[alert.severity as SeverityType]
                        }
                      >
                        {alert.severity}
                      </Badge>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {alert.title}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {alert.site.name}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(alert.createdAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Page principale du dashboard
// Vue d'ensemble : stats, liste des sites, alertes recentes

import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, ArrowUp, ArrowDown, Bell } from "lucide-react";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

export default function DashboardPage() {
  // Les donnees seront chargees dynamiquement en Phase 2
  const stats = [
    {
      title: "Sites surveilles",
      value: "0",
      icon: Globe,
      color: "text-indigo-600",
    },
    {
      title: "Sites en ligne",
      value: "0",
      icon: ArrowUp,
      color: "text-emerald-600",
    },
    {
      title: "Sites hors ligne",
      value: "0",
      icon: ArrowDown,
      color: "text-red-600",
    },
    {
      title: "Alertes non lues",
      value: "0",
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

      {/* Contenu principal - sera rempli en Phase 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mes sites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Globe className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-lg font-medium">Aucun site surveille</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Ajoutez votre premier site pour commencer le monitoring.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertes recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-lg font-medium">Aucune alerte</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Les alertes apparaitront ici quand un probleme sera detecte.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

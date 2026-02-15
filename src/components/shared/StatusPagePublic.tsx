// Composant principal de la page de statut publique
// Affiche les sites, la barre d'uptime et la timeline d'incidents

"use client";

import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UptimeBar } from "@/components/shared/UptimeBar";
import { IncidentTimeline } from "@/components/shared/IncidentTimeline";

interface SiteStatus {
  name: string;
  status: string;
  uptimePercentage: number | null;
  avgResponseTime: number | null;
  lastCheckedAt: string | null;
}

interface Incident {
  type: string;
  severity: string;
  title: string;
  message: string;
  createdAt: string;
  isResolved: boolean;
  resolvedAt: string | null;
}

interface UptimeDay {
  date: string;
  uptimePercent: number;
}

interface StatusPageData {
  owner: string;
  sites: SiteStatus[];
  incidents: Incident[];
  uptimeDays: UptimeDay[];
}

function getStatusIcon(status: string) {
  switch (status) {
    case "UP":
      return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    case "DEGRADED":
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case "DOWN":
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <HelpCircle className="h-5 w-5 text-muted-foreground" />;
  }
}

function getStatusText(status: string) {
  switch (status) {
    case "UP":
      return "Operationnel";
    case "DEGRADED":
      return "Degrade";
    case "DOWN":
      return "Hors ligne";
    default:
      return "Inconnu";
  }
}

function getOverallStatus(sites: SiteStatus[]) {
  if (sites.some((s) => s.status === "DOWN")) return "DOWN";
  if (sites.some((s) => s.status === "DEGRADED")) return "DEGRADED";
  if (sites.every((s) => s.status === "UP")) return "UP";
  return "UNKNOWN";
}

export function StatusPagePublic({ data }: { data: StatusPageData }) {
  const overall = getOverallStatus(data.sites);

  return (
    <div className="space-y-8">
      {/* Statut global */}
      <Card>
        <CardContent className="flex items-center gap-3 pt-6">
          {getStatusIcon(overall)}
          <div>
            <p className="text-lg font-semibold">
              {overall === "UP"
                ? "Tous les systemes sont operationnels"
                : overall === "DEGRADED"
                  ? "Certains systemes sont degrades"
                  : overall === "DOWN"
                    ? "Des systemes sont hors ligne"
                    : "Statut en cours de verification"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Liste des services */}
      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {data.sites.map((site, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(site.status)}
                  <span className="font-medium">{site.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {site.uptimePercentage != null && (
                    <span>{site.uptimePercentage.toFixed(1)}%</span>
                  )}
                  {site.avgResponseTime != null && (
                    <span>{site.avgResponseTime}ms</span>
                  )}
                  <span
                    className={
                      site.status === "UP"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : site.status === "DEGRADED"
                          ? "text-amber-600 dark:text-amber-400"
                          : site.status === "DOWN"
                            ? "text-red-600 dark:text-red-400"
                            : ""
                    }
                  >
                    {getStatusText(site.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Barre d'uptime 90 jours */}
      {data.uptimeDays.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Disponibilite sur 90 jours</CardTitle>
          </CardHeader>
          <CardContent>
            <UptimeBar days={data.uptimeDays} />
          </CardContent>
        </Card>
      )}

      {/* Incidents recents */}
      <Card>
        <CardHeader>
          <CardTitle>Incidents recents</CardTitle>
        </CardHeader>
        <CardContent>
          <IncidentTimeline incidents={data.incidents} />
        </CardContent>
      </Card>
    </div>
  );
}

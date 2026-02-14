// Composant detail d'un site
// Onglets : Vue d'ensemble, SSL, Domaine, Alertes, Parametres

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Site, Check, Alert } from "@/generated/prisma/client";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ExternalLink,
  Trash2,
  Pause,
  Play,
  ArrowLeft,
  Shield,
  Globe,
  Bell,
  Activity,
  Loader2,
} from "lucide-react";
import { UptimeChart } from "@/components/dashboard/UptimeChart";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";
import type { SiteStatus } from "@/types/site";
import type { Severity as SeverityType } from "@/types/alert";

interface SiteDetailProps {
  site: Site;
  checks: Check[];
  alerts: Alert[];
}

const severityColors: Record<SeverityType, string> = {
  INFO: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  WARNING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  CRITICAL: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function SiteDetail({ site, checks, alerts }: SiteDetailProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/sites/${site.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        toast.error("Erreur lors de la suppression");
        setDeleting(false);
        return;
      }

      toast.success("Site supprime");
      router.push("/dashboard/sites");
      router.refresh();
    } catch {
      toast.error("Erreur de connexion");
      setDeleting(false);
    }
  };

  const handleToggle = async () => {
    setToggling(true);
    try {
      const response = await fetch(`/api/sites/${site.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !site.isActive }),
      });

      if (!response.ok) {
        toast.error("Erreur lors de la modification");
        setToggling(false);
        return;
      }

      toast.success(site.isActive ? "Monitoring en pause" : "Monitoring reactive");
      router.refresh();
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setToggling(false);
    }
  };

  const uptimeChecks = checks.filter((c) => c.checkType === "UPTIME");
  const avgResponse =
    uptimeChecks.length > 0
      ? Math.round(
          uptimeChecks.reduce((sum, c) => sum + (c.responseTime || 0), 0) /
            uptimeChecks.length
        )
      : null;

  return (
    <div className="space-y-6">
      {/* En-tete */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2"
            onClick={() => router.push("/dashboard/sites")}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Retour
          </Button>
          <h2 className="text-2xl font-bold">{site.name}</h2>
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
          >
            {site.url}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={site.currentStatus as SiteStatus} />
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggle}
            disabled={toggling}
          >
            {toggling ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : site.isActive ? (
              <Pause className="mr-1 h-4 w-4" />
            ) : (
              <Play className="mr-1 h-4 w-4" />
            )}
            {site.isActive ? "Pause" : "Reprendre"}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-1 h-4 w-4" />
                Supprimer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Supprimer ce site ?</DialogTitle>
                <DialogDescription>
                  Cette action supprimera toutes les donnees associees
                  (historique, alertes). Cette action est irreversible.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => {}}>
                  Annuler
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Supprimer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Onglets */}
      <Tabs defaultValue="uptime">
        <TabsList>
          <TabsTrigger value="uptime">
            <Activity className="mr-1 h-4 w-4" />
            Uptime
          </TabsTrigger>
          <TabsTrigger value="ssl">
            <Shield className="mr-1 h-4 w-4" />
            SSL
          </TabsTrigger>
          <TabsTrigger value="domain">
            <Globe className="mr-1 h-4 w-4" />
            Domaine
          </TabsTrigger>
          <TabsTrigger value="alerts">
            <Bell className="mr-1 h-4 w-4" />
            Alertes
          </TabsTrigger>
        </TabsList>

        {/* Onglet Uptime */}
        <TabsContent value="uptime" className="space-y-4">
          {/* Stats principales */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Disponibilite (30j)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {site.uptimePercentage != null
                    ? `${site.uptimePercentage.toFixed(1)}%`
                    : "-"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Temps moyen (30j)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {avgResponse != null ? `${avgResponse}ms` : "-"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Derniere verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">
                  {site.lastCheckedAt
                    ? formatDistanceToNow(new Date(site.lastCheckedAt), {
                        addSuffix: true,
                        locale: fr,
                      })
                    : "Jamais"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Graphique temps de reponse */}
          <UptimeChart siteId={site.id} />

          {/* Historique des derniers checks */}
          <Card>
            <CardHeader>
              <CardTitle>Derniers checks</CardTitle>
            </CardHeader>
            <CardContent>
              {uptimeChecks.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  Aucune verification effectuee
                </p>
              ) : (
                <div className="space-y-2">
                  {uptimeChecks.slice(0, 10).map((check) => (
                    <div
                      key={check.id}
                      className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <StatusBadge status={check.status as SiteStatus} />
                        <span className="text-muted-foreground">
                          {check.statusCode && `HTTP ${check.statusCode}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        {check.responseTime && (
                          <span>{check.responseTime}ms</span>
                        )}
                        <span className="text-muted-foreground">
                          {format(new Date(check.checkedAt), "dd/MM HH:mm", {
                            locale: fr,
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet SSL */}
        <TabsContent value="ssl">
          <Card>
            <CardHeader>
              <CardTitle>Certificat SSL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Emetteur</p>
                  <p className="font-medium">
                    {site.sslIssuer || "Non verifie"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expiration</p>
                  <p className="font-medium">
                    {site.sslExpiresAt
                      ? format(new Date(site.sslExpiresAt), "dd MMMM yyyy", {
                          locale: fr,
                        })
                      : "Non verifie"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Domaine */}
        <TabsContent value="domain">
          <Card>
            <CardHeader>
              <CardTitle>Nom de domaine</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm text-muted-foreground">Expiration</p>
                <p className="font-medium">
                  {site.domainExpiresAt
                    ? format(new Date(site.domainExpiresAt), "dd MMMM yyyy", {
                        locale: fr,
                      })
                    : "Non verifie"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Alertes */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Alertes recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  Aucune alerte pour ce site
                </p>
              ) : (
                <div className="space-y-2">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between rounded-lg border px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            severityColors[alert.severity as SeverityType]
                          }
                        >
                          {alert.severity}
                        </Badge>
                        <span className="text-sm font-medium">
                          {alert.title}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(alert.createdAt), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

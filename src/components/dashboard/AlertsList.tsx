// Liste des alertes avec filtres et pagination

"use client";

import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";
import { Bell, CheckCheck, ExternalLink, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { Severity as SeverityType } from "@/types/alert";
import Link from "next/link";

interface AlertWithSite {
  id: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  isRead: boolean;
  isResolved: boolean;
  createdAt: string;
  siteId: string;
  site: { name: string; url: string };
}

interface AlertsResponse {
  alerts: AlertWithSite[];
  pagination: {
    page: number;
    total: number;
    totalPages: number;
  };
}

interface AlertsListProps {
  sites: { id: string; name: string }[];
}

const severityColors: Record<SeverityType, string> = {
  INFO: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  WARNING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  CRITICAL: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const alertTypeLabels: Record<string, string> = {
  SITE_DOWN: "Site hors ligne",
  SITE_UP: "Site en ligne",
  SSL_EXPIRING: "SSL expire bientot",
  SSL_EXPIRED: "SSL expire",
  DOMAIN_EXPIRING: "Domaine expire bientot",
  DOMAIN_EXPIRED: "Domaine expire",
  SLOW_RESPONSE: "Reponse lente",
  STATUS_CODE_ERROR: "Erreur HTTP",
};

export function AlertsList({ sites }: AlertsListProps) {
  const [data, setData] = useState<AlertsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Filtres
  const [siteFilter, setSiteFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [readFilter, setReadFilter] = useState("");

  const fetchAlerts = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p) });
      if (siteFilter) params.set("siteId", siteFilter);
      if (typeFilter) params.set("type", typeFilter);
      if (severityFilter) params.set("severity", severityFilter);
      if (readFilter) params.set("isRead", readFilter);

      const response = await fetch(`/api/alerts?${params}`);
      const json = await response.json();
      setData(json);
    } catch {
      toast.error("Erreur lors du chargement des alertes");
    } finally {
      setLoading(false);
    }
  }, [siteFilter, typeFilter, severityFilter, readFilter]);

  useEffect(() => {
    setPage(1);
    fetchAlerts(1);
  }, [fetchAlerts]);

  useEffect(() => {
    fetchAlerts(page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/alerts/read-all", { method: "POST" });
      toast.success("Toutes les alertes marquees comme lues");
      fetchAlerts(page);
    } catch {
      toast.error("Erreur");
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await fetch(`/api/alerts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
      fetchAlerts(page);
    } catch {
      toast.error("Erreur");
    }
  };

  const hasActiveFilters = siteFilter || typeFilter || severityFilter || readFilter;

  const clearFilters = () => {
    setSiteFilter("");
    setTypeFilter("");
    setSeverityFilter("");
    setReadFilter("");
  };

  if (loading && !data) {
    return <LoadingSpinner className="py-12" />;
  }

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 pt-4 pb-4">
          <div className="w-40">
            <label className="mb-1 block text-xs text-muted-foreground">Site</label>
            <Select value={siteFilter} onValueChange={setSiteFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                {sites.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-44">
            <label className="mb-1 block text-xs text-muted-foreground">Type</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(alertTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-36">
            <label className="mb-1 block text-xs text-muted-foreground">Severite</label>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Toutes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CRITICAL">Critique</SelectItem>
                <SelectItem value="WARNING">Avertissement</SelectItem>
                <SelectItem value="INFO">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-32">
            <label className="mb-1 block text-xs text-muted-foreground">Statut</label>
            <Select value={readFilter} onValueChange={setReadFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Non lues</SelectItem>
                <SelectItem value="true">Lues</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
              <X className="mr-1 h-3 w-3" />
              Reinitialiser
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      {data && data.alerts.length > 0 && data.alerts.some((a) => !a.isRead) && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {data.pagination.total} alerte{data.pagination.total > 1 ? "s" : ""}
          </p>
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="mr-1 h-4 w-4" />
            Tout marquer comme lu
          </Button>
        </div>
      )}

      {/* Liste vide */}
      {data && data.alerts.length === 0 && (
        <EmptyState
          icon={Bell}
          title={hasActiveFilters ? "Aucun resultat" : "Aucune alerte"}
          description={
            hasActiveFilters
              ? "Aucune alerte ne correspond a vos filtres."
              : "Les alertes apparaitront ici quand un probleme sera detecte sur un de vos sites."
          }
        />
      )}

      {/* Liste des alertes */}
      {data && data.alerts.length > 0 && (
        <div className="space-y-2">
          {data.alerts.map((alert) => (
            <Card
              key={alert.id}
              className={alert.isRead ? "opacity-60" : ""}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {!alert.isRead && (
                    <div className="h-2 w-2 rounded-full bg-indigo-600" />
                  )}
                  <Badge
                    className={severityColors[alert.severity as SeverityType]}
                  >
                    {alert.severity}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">{alert.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Link
                        href={`/dashboard/sites/${alert.siteId}`}
                        className="flex items-center gap-1 hover:text-primary"
                      >
                        {alert.site.name}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                      <span>
                        {formatDistanceToNow(new Date(alert.createdAt), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                {!alert.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkRead(alert.id)}
                  >
                    Marquer lu
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Precedent
          </Button>
          <span className="flex items-center text-sm text-muted-foreground">
            Page {page} / {data.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.pagination.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
}

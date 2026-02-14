// Liste des alertes avec filtres et pagination

"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";
import { Bell, CheckCheck, ExternalLink } from "lucide-react";
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

const severityColors: Record<SeverityType, string> = {
  INFO: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  WARNING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  CRITICAL: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function AlertsList() {
  const [data, setData] = useState<AlertsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchAlerts = async (p: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/alerts?page=${p}`);
      const json = await response.json();
      setData(json);
    } catch {
      toast.error("Erreur lors du chargement des alertes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts(page);
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

  if (loading && !data) {
    return <LoadingSpinner className="py-12" />;
  }

  if (!data || data.alerts.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="Aucune alerte"
        description="Les alertes apparaitront ici quand un probleme sera detecte sur un de vos sites."
      />
    );
  }

  const hasUnread = data.alerts.some((a) => !a.isRead);

  return (
    <div className="space-y-4">
      {hasUnread && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="mr-1 h-4 w-4" />
            Tout marquer comme lu
          </Button>
        </div>
      )}

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

      {/* Pagination */}
      {data.pagination.totalPages > 1 && (
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

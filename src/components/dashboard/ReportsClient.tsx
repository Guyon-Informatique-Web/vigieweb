// Composant client pour la generation de rapports
// Selectionner un site et generer un rapport mensuel

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  FileText,
  Loader2,
  Activity,
  Clock,
  AlertTriangle,
  Shield,
  Globe,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Site {
  id: string;
  name: string;
  url: string;
}

interface ReportData {
  site: {
    name: string;
    url: string;
    currentStatus: string;
    sslExpiresAt: string | null;
    sslIssuer: string | null;
    domainExpiresAt: string | null;
  };
  period: {
    start: string;
    end: string;
  };
  stats: {
    totalChecks: number;
    uptimePercentage: number | null;
    avgResponseTime: number | null;
    minResponseTime: number | null;
    maxResponseTime: number | null;
    incidentCount: number;
    alertCount: number;
  };
  incidents: {
    type: string;
    severity: string;
    title: string;
    message: string;
    createdAt: string;
  }[];
}

interface ReportsClientProps {
  sites: Site[];
}

export function ReportsClient({ sites }: ReportsClientProps) {
  const [selectedSite, setSelectedSite] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ReportData | null>(null);

  const handleGenerate = async () => {
    if (!selectedSite) {
      toast.error("Selectionnez un site");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/reports?siteId=${selectedSite}`);
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Erreur lors de la generation");
        return;
      }

      setReport(data);
      toast.success("Rapport genere");
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Selecteur de site */}
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Selectionner un site</label>
            <Select value={selectedSite} onValueChange={setSelectedSite}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un site" />
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
          <Button
            onClick={handleGenerate}
            disabled={!selectedSite || loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            Generer le rapport
          </Button>
        </CardContent>
      </Card>

      {/* Rapport genere */}
      {report && (
        <div className="space-y-6 print:space-y-4" id="report">
          {/* En-tete du rapport */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">
                Rapport mensuel - {report.site.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                Periode : {format(new Date(report.period.start), "dd MMMM", { locale: fr })} -{" "}
                {format(new Date(report.period.end), "dd MMMM yyyy", { locale: fr })}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="print:hidden"
            >
              Imprimer / PDF
            </Button>
          </div>

          {/* Stats principales */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="h-4 w-4" />
                  Disponibilite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {report.stats.uptimePercentage != null
                    ? `${report.stats.uptimePercentage}%`
                    : "-"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Temps moyen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {report.stats.avgResponseTime != null
                    ? `${report.stats.avgResponseTime}ms`
                    : "-"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  Incidents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {report.stats.incidentCount}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Verifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {report.stats.totalChecks}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Details performances */}
          <Card>
            <CardHeader>
              <CardTitle>Performances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Temps min</p>
                  <p className="text-lg font-medium">
                    {report.stats.minResponseTime != null
                      ? `${report.stats.minResponseTime}ms`
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Temps moyen</p>
                  <p className="text-lg font-medium">
                    {report.stats.avgResponseTime != null
                      ? `${report.stats.avgResponseTime}ms`
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Temps max</p>
                  <p className="text-lg font-medium">
                    {report.stats.maxResponseTime != null
                      ? `${report.stats.maxResponseTime}ms`
                      : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Etat SSL et domaine */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="h-4 w-4" />
                  Certificat SSL
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Emetteur</p>
                <p className="font-medium">
                  {report.site.sslIssuer || "Non verifie"}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Expiration
                </p>
                <p className="font-medium">
                  {report.site.sslExpiresAt
                    ? format(new Date(report.site.sslExpiresAt), "dd MMMM yyyy", {
                        locale: fr,
                      })
                    : "Non verifie"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Globe className="h-4 w-4" />
                  Nom de domaine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Expiration</p>
                <p className="font-medium">
                  {report.site.domainExpiresAt
                    ? format(
                        new Date(report.site.domainExpiresAt),
                        "dd MMMM yyyy",
                        { locale: fr }
                      )
                    : "Non verifie"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Historique des incidents */}
          {report.incidents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Incidents du mois</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {report.incidents.map((incident, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            incident.severity === "CRITICAL"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {incident.severity}
                        </Badge>
                        <span>{incident.title}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {format(new Date(incident.createdAt), "dd/MM HH:mm", {
                          locale: fr,
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// Graphique de temps de reponse avec Recharts
// Affiche le temps de reponse sur 24h/7j/30j

"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";

interface UptimeChartProps {
  siteId: string;
}

interface CheckData {
  id: string;
  status: string;
  responseTime: number | null;
  checkedAt: string;
}

type Period = "24h" | "7d" | "30d";

const periodLabels: Record<Period, string> = {
  "24h": "24 heures",
  "7d": "7 jours",
  "30d": "30 jours",
};

// Formater la date pour l'axe X selon la periode
function formatDate(dateStr: string, period: Period): string {
  const date = new Date(dateStr);
  if (period === "24h") {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
  });
}

export function UptimeChart({ siteId }: UptimeChartProps) {
  const [period, setPeriod] = useState<Period>("24h");
  const [checks, setChecks] = useState<CheckData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChecks = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/checks?siteId=${siteId}&period=${period}`
        );
        const data = await response.json();
        setChecks(data);
      } catch {
        toast.error("Erreur lors du chargement des donnees");
      } finally {
        setLoading(false);
      }
    };

    fetchChecks();
  }, [siteId, period]);

  // Preparer les donnees pour le graphique
  const chartData = checks
    .filter((c) => c.responseTime !== null)
    .map((c) => ({
      time: formatDate(c.checkedAt, period),
      responseTime: c.responseTime,
      status: c.status,
    }))
    .reverse(); // Ordre chronologique

  // Calculer les stats
  const responseTimes = checks
    .filter((c) => c.responseTime !== null)
    .map((c) => c.responseTime!);

  const avgResponse =
    responseTimes.length > 0
      ? Math.round(
          responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        )
      : null;

  const minResponse =
    responseTimes.length > 0 ? Math.min(...responseTimes) : null;
  const maxResponse =
    responseTimes.length > 0 ? Math.max(...responseTimes) : null;

  return (
    <div className="space-y-4">
      {/* Selecteur de periode */}
      <div className="flex gap-2">
        {(Object.entries(periodLabels) as [Period, string][]).map(
          ([key, label]) => (
            <Button
              key={key}
              variant={period === key ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(key)}
            >
              {label}
            </Button>
          )
        )}
      </div>

      {/* Stats resumes */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Temps moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {avgResponse != null ? `${avgResponse}ms` : "-"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Temps min
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {minResponse != null ? `${minResponse}ms` : "-"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Temps max
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {maxResponse != null ? `${maxResponse}ms` : "-"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphique */}
      <Card>
        <CardHeader>
          <CardTitle>Temps de reponse ({periodLabels[period]})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSpinner className="py-12" />
          ) : chartData.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              Aucune donnee pour cette periode
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="responseGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#4F46E5"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#4F46E5"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted"
                />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                  unit="ms"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                  formatter={(value) => [`${value}ms`, "Reponse"]}
                />
                <Area
                  type="monotone"
                  dataKey="responseTime"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  fill="url(#responseGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

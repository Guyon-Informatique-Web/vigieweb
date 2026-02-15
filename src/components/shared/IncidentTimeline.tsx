// Timeline des incidents des 30 derniers jours
// Affiche les alertes avec leur severite et horodatage

import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

interface Incident {
  type: string;
  severity: string;
  title: string;
  message: string;
  createdAt: string;
  isResolved: boolean;
  resolvedAt: string | null;
}

interface IncidentTimelineProps {
  incidents: Incident[];
}

function getSeverityIcon(severity: string) {
  switch (severity) {
    case "CRITICAL":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "WARNING":
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    default:
      return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
  }
}

function getSeverityBadge(severity: string) {
  switch (severity) {
    case "CRITICAL":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    case "WARNING":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    default:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
  }
}

export function IncidentTimeline({ incidents }: IncidentTimelineProps) {
  if (incidents.length === 0) {
    return (
      <div className="rounded-lg border bg-emerald-50 p-6 text-center dark:bg-emerald-950/20">
        <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-500" />
        <p className="font-medium text-emerald-800 dark:text-emerald-400">
          Aucun incident ces 30 derniers jours
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {incidents.map((incident, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-lg border p-3"
        >
          {getSeverityIcon(incident.severity)}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{incident.title}</span>
              <span
                className={`rounded px-1.5 py-0.5 text-xs font-medium ${getSeverityBadge(incident.severity)}`}
              >
                {incident.severity === "CRITICAL"
                  ? "Critique"
                  : incident.severity === "WARNING"
                    ? "Avertissement"
                    : "Info"}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {incident.message}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {new Date(incident.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}
              {incident.isResolved && incident.resolvedAt && (
                <span>
                  {" "}
                  - Resolu le{" "}
                  {new Date(incident.resolvedAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

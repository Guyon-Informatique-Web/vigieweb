// Badge de statut pour les sites (UP, DOWN, DEGRADED, UNKNOWN)

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SiteStatus } from "@/types/site";

const statusConfig: Record<
  SiteStatus,
  { label: string; className: string }
> = {
  UP: {
    label: "En ligne",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  DOWN: {
    label: "Hors ligne",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  DEGRADED: {
    label: "Degrade",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  UNKNOWN: {
    label: "Inconnu",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  },
};

interface StatusBadgeProps {
  status: SiteStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}

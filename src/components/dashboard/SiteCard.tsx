// Carte d'un site dans la liste
// Affiche le statut, uptime, temps de reponse, derniere verification

import Link from "next/link";
import type { Site } from "@/generated/prisma/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Clock, Globe, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { SiteStatus } from "@/types/site";

interface SiteCardProps {
  site: Site;
}

export function SiteCard({ site }: SiteCardProps) {
  const lastChecked = site.lastCheckedAt
    ? formatDistanceToNow(new Date(site.lastCheckedAt), {
        addSuffix: true,
        locale: fr,
      })
    : "Jamais";

  return (
    <Link href={`/dashboard/sites/${site.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-base">{site.name}</CardTitle>
            <p className="mt-1 flex items-center gap-1 truncate text-sm text-muted-foreground">
              <Globe className="h-3 w-3 shrink-0" />
              {site.url}
            </p>
          </div>
          <StatusBadge status={site.currentStatus as SiteStatus} />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Uptime</p>
              <p className="font-medium">
                {site.uptimePercentage != null
                  ? `${site.uptimePercentage.toFixed(1)}%`
                  : "-"}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-muted-foreground">
                <Zap className="h-3 w-3" />
                Reponse
              </p>
              <p className="font-medium">
                {site.avgResponseTime != null
                  ? `${site.avgResponseTime}ms`
                  : "-"}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                Check
              </p>
              <p className="font-medium">{lastChecked}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

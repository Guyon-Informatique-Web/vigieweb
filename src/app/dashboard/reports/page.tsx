// Page des rapports - Generation de rapports mensuels par site
// Disponible uniquement pour les plans Pro et Agence

import type { Metadata } from "next";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PLANS } from "@/config/plans";
import type { Plan } from "@/generated/prisma/client";
import { ReportsClient } from "@/components/dashboard/ReportsClient";
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Rapports",
};

export default async function ReportsPage() {
  const { user, error } = await getAuthUser();
  if (error) redirect("/login");

  const plan = PLANS[user!.plan as Plan];

  // Si le plan ne permet pas les rapports, afficher un message
  if (!plan.limits.reports) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Rapports</h2>
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Lock className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium">
              Fonctionnalite disponible a partir du plan Pro
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Generez des rapports mensuels detailles pour chacun de vos sites.
            </p>
            <Link href="/dashboard/settings/billing" className="mt-4">
              <Button>Passer au plan Pro</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sites = await prisma.site.findMany({
    where: { userId: user!.id },
    orderBy: { name: "asc" },
    select: { id: true, name: true, url: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Rapports</h2>
        <p className="text-muted-foreground">
          Generez des rapports mensuels pour vos sites
        </p>
      </div>

      <ReportsClient sites={sites} />
    </div>
  );
}

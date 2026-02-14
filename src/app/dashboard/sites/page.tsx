// Page liste des sites
// Affiche tous les sites de l'utilisateur avec filtres et actions

import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SiteCard } from "@/components/dashboard/SiteCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Mes sites",
};

export default async function SitesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const sites = await prisma.site.findMany({
    where: { userId: user!.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mes sites</h2>
        <Button asChild>
          <Link href="/dashboard/sites/add">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un site
          </Link>
        </Button>
      </div>

      {sites.length === 0 ? (
        <EmptyState
          icon={Globe}
          title="Aucun site surveille"
          description="Ajoutez votre premier site pour commencer le monitoring."
        >
          <Button asChild>
            <Link href="/dashboard/sites/add">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un site
            </Link>
          </Button>
        </EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      )}
    </div>
  );
}

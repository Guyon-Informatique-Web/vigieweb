// Page des parametres du compte
// Modifier le nom, page de statut, etc.

import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AccountClient } from "@/components/dashboard/AccountClient";
import { StatusPageSettings } from "@/components/dashboard/StatusPageSettings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parametres",
};

export default async function SettingsPage() {
  const { user, error } = await getAuthUser();
  if (error) redirect("/login");

  // Recuperer les sites de l'utilisateur pour la config status page
  const sites = await prisma.site.findMany({
    where: { userId: user!.id },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Parametres du compte</h2>
        <p className="text-muted-foreground">
          Gerez votre profil et votre compte
        </p>
      </div>

      <AccountClient
        name={user!.name || ""}
        email={user!.email}
      />

      <StatusPageSettings
        enabled={user!.statusPageEnabled}
        slug={user!.statusSlug || ""}
        selectedSiteIds={user!.statusSiteIds}
        sites={sites}
      />
    </div>
  );
}

// Page liste des alertes
// Filtres par site, type, severite, lu/non lu

import type { Metadata } from "next";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AlertsList } from "@/components/dashboard/AlertsList";

export const metadata: Metadata = {
  title: "Alertes",
};

export default async function AlertsPage() {
  const { user, error } = await getAuthUser();
  if (error) redirect("/login");

  const sites = await prisma.site.findMany({
    where: { userId: user!.id },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Alertes</h2>
      <AlertsList sites={sites} />
    </div>
  );
}

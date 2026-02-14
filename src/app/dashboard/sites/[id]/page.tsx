// Page detail d'un site
// Onglets : Uptime, SSL, Domaine, Alertes, Parametres

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { SiteDetail } from "@/components/dashboard/SiteDetail";

export const metadata: Metadata = {
  title: "Detail du site",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SiteDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const site = await prisma.site.findUnique({
    where: { id },
  });

  // Verifier que le site existe et appartient a l'utilisateur
  if (!site || site.userId !== user!.id) {
    notFound();
  }

  // Recuperer les derniers checks
  const recentChecks = await prisma.check.findMany({
    where: { siteId: id },
    orderBy: { checkedAt: "desc" },
    take: 50,
  });

  // Recuperer les alertes recentes
  const recentAlerts = await prisma.alert.findMany({
    where: { siteId: id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <SiteDetail
      site={site}
      checks={recentChecks}
      alerts={recentAlerts}
    />
  );
}

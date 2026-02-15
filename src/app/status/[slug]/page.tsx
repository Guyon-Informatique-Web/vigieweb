// Page de statut publique
// Server component avec metadata dynamique

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatusPagePublic } from "@/components/shared/StatusPagePublic";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://vigieweb.fr";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const user = await prisma.user.findUnique({
    where: { statusSlug: slug },
    select: { name: true, statusPageEnabled: true },
  });

  if (!user || !user.statusPageEnabled) {
    return { title: "Page de statut introuvable" };
  }

  const ownerName = user.name || "Utilisateur";

  return {
    title: `Statut des services - ${ownerName}`,
    description: `Page de statut en temps reel des services de ${ownerName}. Surveillee par Vigie Web.`,
    openGraph: {
      title: `Statut des services - ${ownerName}`,
      description: `Disponibilite et incidents des services de ${ownerName}.`,
      url: `${BASE_URL}/status/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function StatusPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Appel direct a la BDD plutot qu'a l'API interne
  const user = await prisma.user.findUnique({
    where: { statusSlug: slug },
    select: {
      statusPageEnabled: true,
      statusSiteIds: true,
      name: true,
    },
  });

  if (!user || !user.statusPageEnabled) {
    notFound();
  }

  // Recuperer les sites
  const sites = await prisma.site.findMany({
    where: { id: { in: user.statusSiteIds } },
    select: {
      name: true,
      currentStatus: true,
      uptimePercentage: true,
      avgResponseTime: true,
      lastCheckedAt: true,
    },
  });

  // Incidents 30 jours
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const incidents = await prisma.alert.findMany({
    where: {
      siteId: { in: user.statusSiteIds },
      type: { in: ["SITE_DOWN", "SITE_UP", "SSL_EXPIRED"] },
      createdAt: { gte: thirtyDaysAgo },
    },
    select: {
      type: true,
      severity: true,
      title: true,
      message: true,
      createdAt: true,
      isResolved: true,
      resolvedAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // Checks 90 jours pour barre d'uptime
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const checks = await prisma.check.findMany({
    where: {
      siteId: { in: user.statusSiteIds },
      checkType: "UPTIME",
      checkedAt: { gte: ninetyDaysAgo },
    },
    select: { status: true, checkedAt: true },
    orderBy: { checkedAt: "asc" },
  });

  const dailyStatus: Record<string, { total: number; up: number }> = {};
  checks.forEach((check) => {
    const day = check.checkedAt.toISOString().slice(0, 10);
    if (!dailyStatus[day]) dailyStatus[day] = { total: 0, up: 0 };
    dailyStatus[day].total++;
    if (check.status === "UP") dailyStatus[day].up++;
  });

  const uptimeDays = Object.entries(dailyStatus)
    .map(([date, data]) => ({
      date,
      uptimePercent: Math.round((data.up / data.total) * 100),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const data = {
    owner: user.name || "Utilisateur",
    sites: sites.map((s) => ({
      name: s.name,
      status: s.currentStatus,
      uptimePercentage: s.uptimePercentage,
      avgResponseTime: s.avgResponseTime,
      lastCheckedAt: s.lastCheckedAt?.toISOString() || null,
    })),
    incidents: incidents.map((inc) => ({
      type: inc.type,
      severity: inc.severity,
      title: inc.title,
      message: inc.message,
      createdAt: inc.createdAt.toISOString(),
      isResolved: inc.isResolved,
      resolvedAt: inc.resolvedAt?.toISOString() || null,
    })),
    uptimeDays,
  };

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">
        Statut des services - {data.owner}
      </h1>
      <StatusPagePublic data={data} />
    </div>
  );
}

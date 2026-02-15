// API publique page de statut
// GET sans auth : donnees publiques (nom, statut, uptime %, response time)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Trouver l'utilisateur par slug
  const user = await prisma.user.findUnique({
    where: { statusSlug: slug },
    select: {
      statusPageEnabled: true,
      statusSiteIds: true,
      name: true,
    },
  });

  if (!user || !user.statusPageEnabled) {
    return NextResponse.json(
      { error: "Page de statut introuvable" },
      { status: 404 }
    );
  }

  // Recuperer les sites selectionnes (donnees publiques uniquement)
  const sites = await prisma.site.findMany({
    where: {
      id: { in: user.statusSiteIds },
    },
    select: {
      name: true,
      currentStatus: true,
      uptimePercentage: true,
      avgResponseTime: true,
      lastCheckedAt: true,
    },
  });

  // Recuperer les incidents recents (30 derniers jours)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const siteIds = user.statusSiteIds;
  const incidents = await prisma.alert.findMany({
    where: {
      siteId: { in: siteIds },
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

  // Recuperer les checks des 90 derniers jours pour la barre d'uptime
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const checks = await prisma.check.findMany({
    where: {
      siteId: { in: siteIds },
      checkType: "UPTIME",
      checkedAt: { gte: ninetyDaysAgo },
    },
    select: {
      status: true,
      checkedAt: true,
    },
    orderBy: { checkedAt: "asc" },
  });

  // Agreger par jour
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

  return NextResponse.json(
    {
      owner: user.name || "Utilisateur",
      sites: sites.map((s) => ({
        name: s.name,
        status: s.currentStatus,
        uptimePercentage: s.uptimePercentage,
        avgResponseTime: s.avgResponseTime,
        lastCheckedAt: s.lastCheckedAt,
      })),
      incidents,
      uptimeDays,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    }
  );
}

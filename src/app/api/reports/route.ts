// API route pour les rapports de monitoring
// GET /api/reports?siteId=xxx - Generer les donnees d'un rapport mensuel

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { PLANS } from "@/config/plans";
import type { Plan } from "@/generated/prisma/client";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  // Rate limit : 10 rapports par minute par IP
  const ip = getClientIp(request.headers);
  const rl = rateLimit(`reports:${ip}`, { maxRequests: 10, windowSeconds: 60 });
  if (!rl.success) {
    return NextResponse.json(
      { error: "Trop de requetes, reessayez dans quelques instants" },
      { status: 429 }
    );
  }

  const { user, error } = await getAuthUser();
  if (error) return error;

  // Verifier que le plan permet les rapports
  const plan = PLANS[user!.plan as Plan];
  if (!plan.limits.reports) {
    return NextResponse.json(
      { error: "Les rapports sont disponibles a partir du plan Pro" },
      { status: 403 }
    );
  }

  const siteId = request.nextUrl.searchParams.get("siteId");
  if (!siteId) {
    return NextResponse.json(
      { error: "siteId requis" },
      { status: 400 }
    );
  }

  // Verifier que le site appartient a l'utilisateur
  const site = await prisma.site.findFirst({
    where: { id: siteId, userId: user!.id },
  });

  if (!site) {
    return NextResponse.json(
      { error: "Site non trouve" },
      { status: 404 }
    );
  }

  // Recuperer les donnees du mois en cours
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [uptimeChecks, allAlerts] = await Promise.all([
    prisma.check.findMany({
      where: {
        siteId,
        checkType: "UPTIME",
        checkedAt: { gte: startOfMonth },
      },
      orderBy: { checkedAt: "asc" },
    }),
    prisma.alert.findMany({
      where: {
        siteId,
        createdAt: { gte: startOfMonth },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Calculer les statistiques
  const totalChecks = uptimeChecks.length;
  const upChecks = uptimeChecks.filter((c) => c.status === "UP").length;
  const downChecks = uptimeChecks.filter((c) => c.status === "DOWN").length;
  const uptimePercentage = totalChecks > 0 ? (upChecks / totalChecks) * 100 : null;

  const responseTimes = uptimeChecks
    .filter((c) => c.responseTime !== null)
    .map((c) => c.responseTime!);
  const avgResponseTime =
    responseTimes.length > 0
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : null;
  const minResponseTime =
    responseTimes.length > 0 ? Math.min(...responseTimes) : null;
  const maxResponseTime =
    responseTimes.length > 0 ? Math.max(...responseTimes) : null;

  const incidents = allAlerts.filter(
    (a) => a.type === "SITE_DOWN" || a.type === "SSL_EXPIRED" || a.type === "DOMAIN_EXPIRED"
  );

  return NextResponse.json({
    site: {
      name: site.name,
      url: site.url,
      currentStatus: site.currentStatus,
      sslExpiresAt: site.sslExpiresAt,
      sslIssuer: site.sslIssuer,
      domainExpiresAt: site.domainExpiresAt,
    },
    period: {
      start: startOfMonth.toISOString(),
      end: now.toISOString(),
    },
    stats: {
      totalChecks,
      uptimePercentage: uptimePercentage ? Math.round(uptimePercentage * 100) / 100 : null,
      avgResponseTime,
      minResponseTime,
      maxResponseTime,
      incidentCount: incidents.length,
      alertCount: allAlerts.length,
    },
    incidents: incidents.slice(0, 20).map((a) => ({
      type: a.type,
      severity: a.severity,
      title: a.title,
      message: a.message,
      createdAt: a.createdAt,
    })),
  });
}

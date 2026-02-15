// API admin : statistiques globales
// GET : total users, MRR, sites, erreurs

import { NextResponse } from "next/server";
import { getAuthAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await getAuthAdmin();
  if (error) return error;

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    freeUsers,
    proUsers,
    agencyUsers,
    totalActiveSites,
    checks24h,
    totalSubscribers,
    unresolvedErrors,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { plan: "FREE" } }),
    prisma.user.count({ where: { plan: "PRO" } }),
    prisma.user.count({ where: { plan: "AGENCY" } }),
    prisma.site.count({ where: { isActive: true } }),
    prisma.check.count({ where: { checkedAt: { gte: twentyFourHoursAgo } } }),
    prisma.subscriber.count(),
    prisma.errorLog.count({ where: { isResolved: false } }),
  ]);

  const mrr = proUsers * 9.99 + agencyUsers * 29.99;

  return NextResponse.json({
    users: {
      total: totalUsers,
      free: freeUsers,
      pro: proUsers,
      agency: agencyUsers,
    },
    sites: totalActiveSites,
    checks24h,
    mrr: Math.round(mrr * 100) / 100,
    subscribers: totalSubscribers,
    unresolvedErrors,
  });
}

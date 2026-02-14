// API route pour l'historique des checks
// GET /api/checks?siteId=xxx&period=24h

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

const PERIODS: Record<string, number> = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

export async function GET(request: NextRequest) {
  const { user, error } = await getAuthUser();
  if (error) return error;

  const { searchParams } = request.nextUrl;
  const siteId = searchParams.get("siteId");
  const period = searchParams.get("period") || "24h";

  if (!siteId) {
    return NextResponse.json(
      { error: "siteId est requis" },
      { status: 400 }
    );
  }

  // Verifier que le site appartient a l'utilisateur
  const site = await prisma.site.findUnique({
    where: { id: siteId },
  });

  if (!site || site.userId !== user!.id) {
    return NextResponse.json({ error: "Site non trouve" }, { status: 404 });
  }

  const periodMs = PERIODS[period] || PERIODS["24h"];
  const since = new Date(Date.now() - periodMs);

  const checks = await prisma.check.findMany({
    where: {
      siteId,
      checkedAt: { gte: since },
    },
    orderBy: { checkedAt: "desc" },
    take: 500,
  });

  return NextResponse.json(checks);
}

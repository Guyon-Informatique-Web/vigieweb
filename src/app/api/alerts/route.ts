// API routes pour les alertes
// GET /api/alerts - Liste des alertes de l'utilisateur

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { user, error } = await getAuthUser();
  if (error) return error;

  const { searchParams } = request.nextUrl;
  const siteId = searchParams.get("siteId");
  const type = searchParams.get("type");
  const severity = searchParams.get("severity");
  const isRead = searchParams.get("isRead");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;

  // Construire les filtres
  const where: Record<string, unknown> = { userId: user!.id };
  if (siteId) where.siteId = siteId;
  if (type) where.type = type;
  if (severity) where.severity = severity;
  if (isRead === "true") where.isRead = true;
  if (isRead === "false") where.isRead = false;

  const [alerts, total] = await Promise.all([
    prisma.alert.findMany({
      where,
      include: { site: { select: { name: true, url: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.alert.count({ where }),
  ]);

  return NextResponse.json({
    alerts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

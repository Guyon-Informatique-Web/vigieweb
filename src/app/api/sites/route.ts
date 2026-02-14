// API routes pour la liste et creation de sites
// GET /api/sites - Liste des sites de l'utilisateur
// POST /api/sites - Ajouter un nouveau site

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { createSiteSchema } from "@/lib/validations";
import { PLANS } from "@/config/plans";
import type { Plan } from "@/generated/prisma/client";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET() {
  const { user, error } = await getAuthUser();
  if (error) return error;

  const sites = await prisma.site.findMany({
    where: { userId: user!.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(sites);
}

export async function POST(request: NextRequest) {
  // Rate limit : 10 creations par minute par IP
  const ip = getClientIp(request.headers);
  const rl = rateLimit(`sites:create:${ip}`, { maxRequests: 10, windowSeconds: 60 });
  if (!rl.success) {
    return NextResponse.json(
      { error: "Trop de requetes, reessayez dans quelques instants" },
      { status: 429 }
    );
  }

  const { user, error } = await getAuthUser();
  if (error) return error;

  // Valider les donnees
  const body = await request.json();
  const result = createSiteSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  // Verifier la limite de sites selon le plan
  const plan = PLANS[user!.plan as Plan];
  const siteCount = await prisma.site.count({
    where: { userId: user!.id },
  });

  if (siteCount >= plan.limits.maxSites) {
    return NextResponse.json(
      {
        error: `Limite atteinte (${plan.limits.maxSites} site${plan.limits.maxSites > 1 ? "s" : ""} pour le plan ${plan.name})`,
      },
      { status: 403 }
    );
  }

  // Creer le site
  const site = await prisma.site.create({
    data: {
      userId: user!.id,
      name: result.data.name,
      url: result.data.url,
      isActive: result.data.isActive,
    },
  });

  return NextResponse.json(site, { status: 201 });
}

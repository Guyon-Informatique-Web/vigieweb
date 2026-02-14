// API routes pour la liste et creation de sites
// GET /api/sites - Liste des sites de l'utilisateur
// POST /api/sites - Ajouter un nouveau site

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { createSiteSchema } from "@/lib/validations";
import { PLANS } from "@/config/plans";
import type { Plan } from "@/generated/prisma/client";

export async function GET() {
  const { user, error } = await getAuthUser();
  if (error) return error;

  const sites = await prisma.site.findMany({
    where: { userId: user!.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(sites);
}

export async function POST(request: Request) {
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

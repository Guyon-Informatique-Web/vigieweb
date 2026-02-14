// API routes pour un site specifique
// GET /api/sites/[id] - Detail d'un site
// PATCH /api/sites/[id] - Modifier un site
// DELETE /api/sites/[id] - Supprimer un site

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { updateSiteSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Verifie que le site existe et appartient a l'utilisateur
async function getSiteForUser(siteId: string, userId: string) {
  const site = await prisma.site.findUnique({
    where: { id: siteId },
  });

  if (!site || site.userId !== userId) {
    return null;
  }

  return site;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { user, error } = await getAuthUser();
  if (error) return error;

  const { id } = await params;
  const site = await getSiteForUser(id, user!.id);

  if (!site) {
    return NextResponse.json({ error: "Site non trouve" }, { status: 404 });
  }

  return NextResponse.json(site);
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { user, error } = await getAuthUser();
  if (error) return error;

  const { id } = await params;
  const site = await getSiteForUser(id, user!.id);

  if (!site) {
    return NextResponse.json({ error: "Site non trouve" }, { status: 404 });
  }

  // Valider les donnees
  const body = await request.json();
  const result = updateSiteSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const updated = await prisma.site.update({
    where: { id },
    data: result.data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { user, error } = await getAuthUser();
  if (error) return error;

  const { id } = await params;
  const site = await getSiteForUser(id, user!.id);

  if (!site) {
    return NextResponse.json({ error: "Site non trouve" }, { status: 404 });
  }

  // Supprime le site et toutes les donnees associees (cascade)
  await prisma.site.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

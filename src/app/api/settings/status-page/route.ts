// API configuration de la page de statut publique
// PATCH : toggle, slug, selection des sites

import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const statusPageSchema = z.object({
  statusPageEnabled: z.boolean().optional(),
  statusSlug: z
    .string()
    .min(3, "Le slug doit contenir au moins 3 caracteres")
    .max(50, "Le slug ne peut pas depasser 50 caracteres")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets"
    )
    .optional(),
  statusSiteIds: z.array(z.string()).optional(),
});

export async function PATCH(request: NextRequest) {
  const { user, error } = await getAuthUser();
  if (error) return error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corps de requete invalide" },
      { status: 400 }
    );
  }

  const result = statusPageSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message || "Donnees invalides" },
      { status: 400 }
    );
  }

  const { statusPageEnabled, statusSlug, statusSiteIds } = result.data;

  // Verifier unicite du slug si fourni
  if (statusSlug) {
    const existing = await prisma.user.findUnique({
      where: { statusSlug },
    });
    if (existing && existing.id !== user!.id) {
      return NextResponse.json(
        { error: "Ce slug est deja utilise" },
        { status: 409 }
      );
    }
  }

  // Verifier que les sites appartiennent a l'utilisateur
  if (statusSiteIds && statusSiteIds.length > 0) {
    const userSites = await prisma.site.findMany({
      where: { userId: user!.id },
      select: { id: true },
    });
    const userSiteIds = new Set(userSites.map((s) => s.id));
    const invalidIds = statusSiteIds.filter((id) => !userSiteIds.has(id));
    if (invalidIds.length > 0) {
      return NextResponse.json(
        { error: "Certains sites ne vous appartiennent pas" },
        { status: 403 }
      );
    }
  }

  // Mise a jour
  const updateData: Record<string, unknown> = {};
  if (statusPageEnabled !== undefined)
    updateData.statusPageEnabled = statusPageEnabled;
  if (statusSlug !== undefined) updateData.statusSlug = statusSlug;
  if (statusSiteIds !== undefined) updateData.statusSiteIds = statusSiteIds;

  const updated = await prisma.user.update({
    where: { id: user!.id },
    data: updateData,
  });

  return NextResponse.json({
    statusPageEnabled: updated.statusPageEnabled,
    statusSlug: updated.statusSlug,
    statusSiteIds: updated.statusSiteIds,
  });
}

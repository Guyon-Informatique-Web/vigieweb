// API route pour les parametres du compte
// PATCH /api/settings/account - Mettre a jour le profil
// DELETE /api/settings/account - Supprimer le compte

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const updateSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100).optional(),
});

export async function PATCH(request: Request) {
  const { user, error } = await getAuthUser();
  if (error) return error;

  const body = await request.json();
  const result = updateSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const updated = await prisma.user.update({
    where: { id: user!.id },
    data: result.data,
  });

  return NextResponse.json({
    name: updated.name,
    email: updated.email,
  });
}

export async function DELETE(request: NextRequest) {
  // Rate limit : 3 suppressions par heure par IP
  const ip = getClientIp(request.headers);
  const rl = rateLimit(`account-delete:${ip}`, { maxRequests: 3, windowSeconds: 3600 });
  if (!rl.success) {
    return NextResponse.json(
      { error: "Trop de requetes, reessayez plus tard" },
      { status: 429 }
    );
  }

  const { user, error } = await getAuthUser();
  if (error) return error;

  // Supprimer toutes les donnees de l'utilisateur (cascade)
  await prisma.user.delete({
    where: { id: user!.id },
  });

  // Supprimer le compte Supabase Auth
  const supabase = await createClient();
  await supabase.auth.signOut();

  return NextResponse.json({ success: true });
}

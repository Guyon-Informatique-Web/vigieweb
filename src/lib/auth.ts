// Utilitaires d'authentification pour les API routes
// Verifie la session et recupere l'utilisateur

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Recupere l'utilisateur connecte ou retourne une erreur 401
export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return { user: null, error: NextResponse.json({ error: "Non authentifie" }, { status: 401 }) };
  }

  // Recuperer ou creer l'utilisateur dans la BDD Prisma
  let user = await prisma.user.findUnique({
    where: { id: authUser.id },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata?.name || null,
        avatarUrl: authUser.user_metadata?.avatar_url || null,
      },
    });
  }

  return { user, error: null };
}

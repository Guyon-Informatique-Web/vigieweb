// Verification des droits admin
// Reutilise getAuthUser() et verifie isAdmin

import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function getAuthAdmin() {
  const { user, error } = await getAuthUser();

  if (error || !user) {
    return { user: null, error: error || NextResponse.json({ error: "Non authentifie" }, { status: 401 }) };
  }

  if (!user.isAdmin) {
    return { user: null, error: NextResponse.json({ error: "Acces refuse" }, { status: 403 }) };
  }

  return { user, error: null };
}

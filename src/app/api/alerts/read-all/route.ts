// API route pour marquer toutes les alertes comme lues
// POST /api/alerts/read-all

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST() {
  const { user, error } = await getAuthUser();
  if (error) return error;

  await prisma.alert.updateMany({
    where: { userId: user!.id, isRead: false },
    data: { isRead: true },
  });

  return NextResponse.json({ success: true });
}

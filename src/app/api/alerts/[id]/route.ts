// API route pour modifier une alerte
// PATCH /api/alerts/[id] - Marquer comme lu/resolu

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { user, error } = await getAuthUser();
  if (error) return error;

  const { id } = await params;
  const alert = await prisma.alert.findUnique({ where: { id } });

  if (!alert || alert.userId !== user!.id) {
    return NextResponse.json({ error: "Alerte non trouvee" }, { status: 404 });
  }

  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (typeof body.isRead === "boolean") data.isRead = body.isRead;
  if (typeof body.isResolved === "boolean") {
    data.isResolved = body.isResolved;
    if (body.isResolved) data.resolvedAt = new Date();
  }

  const updated = await prisma.alert.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}

// API admin : gestion des erreurs systeme
// GET : liste paginee avec filtre par level
// PATCH : marquer comme resolue

import { NextRequest, NextResponse } from "next/server";
import { getAuthAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import type { ErrorLevel } from "@/generated/prisma/client";

const VALID_LEVELS: ErrorLevel[] = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"];

export async function GET(request: NextRequest) {
  const { error } = await getAuthAdmin();
  if (error) return error;

  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const levelParam = searchParams.get("level");

  const where: Record<string, unknown> = {};
  if (levelParam && VALID_LEVELS.includes(levelParam as ErrorLevel)) {
    where.level = levelParam;
  }

  const [errors, total] = await Promise.all([
    prisma.errorLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.errorLog.count({ where }),
  ]);

  return NextResponse.json({
    errors,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function PATCH(request: NextRequest) {
  const { error } = await getAuthAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const { id, isResolved } = body;

    if (!id || typeof isResolved !== "boolean") {
      return NextResponse.json({ error: "Donnees invalides" }, { status: 400 });
    }

    const updated = await prisma.errorLog.update({
      where: { id },
      data: {
        isResolved,
        resolvedAt: isResolved ? new Date() : null,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

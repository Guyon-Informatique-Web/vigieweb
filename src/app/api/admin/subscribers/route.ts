// API admin : liste des abonnes newsletter
// GET : liste paginee

import { NextRequest, NextResponse } from "next/server";
import { getAuthAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { error } = await getAuthAdmin();
  if (error) return error;

  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));

  const [subscribers, total] = await Promise.all([
    prisma.subscriber.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.subscriber.count(),
  ]);

  return NextResponse.json({
    subscribers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

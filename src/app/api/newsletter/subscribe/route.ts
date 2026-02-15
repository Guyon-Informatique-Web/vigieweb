// API inscription newsletter
// POST : rate limit 5/min/IP, validation email, anti-doublon

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { subscriberSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  // Rate limiting : 5 requetes par minute par IP
  const ip = getClientIp(request.headers);
  const limiter = rateLimit(`newsletter:${ip}`, {
    maxRequests: 5,
    windowSeconds: 60,
  });

  if (!limiter.success) {
    return NextResponse.json(
      { error: "Trop de requetes. Reessayez dans quelques instants." },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(
            (limiter.resetAt - Date.now()) / 1000
          ).toString(),
        },
      }
    );
  }

  // Validation du body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corps de requete invalide" },
      { status: 400 }
    );
  }

  const result = subscriberSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message || "Donnees invalides" },
      { status: 400 }
    );
  }

  const { email, source } = result.data;

  // Anti-doublon
  const existing = await prisma.subscriber.findUnique({
    where: { email },
  });

  if (existing) {
    // Retourner 201 meme si deja inscrit (pas de fuite d'information)
    return NextResponse.json(
      { message: "Inscription confirmee" },
      { status: 201 }
    );
  }

  // Insertion en BDD
  await prisma.subscriber.create({
    data: { email, source },
  });

  return NextResponse.json(
    { message: "Inscription confirmee" },
    { status: 201 }
  );
}

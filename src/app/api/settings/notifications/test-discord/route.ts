// API route pour tester le webhook Discord
// POST /api/settings/notifications/test-discord

import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { sendDiscordAlert } from "@/lib/notifications/discord";
import { z } from "zod";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const testSchema = z.object({
  webhookUrl: z
    .string()
    .url()
    .startsWith("https://discord.com/api/webhooks/"),
});

export async function POST(request: NextRequest) {
  // Rate limit : 3 tests par minute par IP
  const ip = getClientIp(request.headers);
  const rl = rateLimit(`discord-test:${ip}`, { maxRequests: 3, windowSeconds: 60 });
  if (!rl.success) {
    return NextResponse.json(
      { error: "Trop de requetes, reessayez dans quelques instants" },
      { status: 429 }
    );
  }

  const { error } = await getAuthUser();
  if (error) return error;

  const body = await request.json();
  const result = testSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "URL de webhook Discord invalide" },
      { status: 400 }
    );
  }

  const success = await sendDiscordAlert({
    webhookUrl: result.data.webhookUrl,
    siteName: "Site de test",
    siteUrl: "https://example.com",
    alertTitle: "Test de notification",
    alertMessage: "Ceci est un test de notification Discord depuis Vigie Web. Si vous voyez ce message, la configuration est correcte.",
    severity: "INFO",
    siteId: "test",
  });

  if (!success) {
    return NextResponse.json(
      { error: "Echec de l'envoi du webhook Discord" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

// API route pour les parametres de notification
// PATCH /api/settings/notifications - Mettre a jour les preferences

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";

const notificationSchema = z.object({
  notifyEmail: z.boolean().optional(),
  notifyDiscord: z.boolean().optional(),
  discordWebhookUrl: z
    .string()
    .url("URL de webhook invalide")
    .startsWith("https://discord.com/api/webhooks/", "URL de webhook Discord invalide")
    .nullable()
    .optional(),
});

export async function PATCH(request: Request) {
  const { user, error } = await getAuthUser();
  if (error) return error;

  const body = await request.json();
  const result = notificationSchema.safeParse(body);

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
    notifyEmail: updated.notifyEmail,
    notifyDiscord: updated.notifyDiscord,
    discordWebhookUrl: updated.discordWebhookUrl,
  });
}

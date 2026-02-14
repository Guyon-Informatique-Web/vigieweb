// Envoi de notifications Discord via webhook
// Envoie un embed avec couleur selon la severite

import { APP_CONFIG } from "@/config/app";

interface DiscordAlertData {
  webhookUrl: string;
  siteName: string;
  siteUrl: string;
  alertTitle: string;
  alertMessage: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  siteId: string;
}

// Couleurs Discord (format decimal)
const severityColors = {
  INFO: 0x3b82f6, // bleu
  WARNING: 0xf59e0b, // orange
  CRITICAL: 0xef4444, // rouge
};

// Envoyer une notification Discord via webhook
export async function sendDiscordAlert(
  data: DiscordAlertData
): Promise<boolean> {
  try {
    const dashboardUrl = `${APP_CONFIG.url}/dashboard/sites/${data.siteId}`;

    const embed = {
      title: data.alertTitle,
      description: data.alertMessage,
      color: severityColors[data.severity],
      fields: [
        {
          name: "Site",
          value: `[${data.siteName}](${data.siteUrl})`,
          inline: true,
        },
        {
          name: "Severite",
          value: data.severity,
          inline: true,
        },
      ],
      footer: {
        text: APP_CONFIG.name,
      },
      timestamp: new Date().toISOString(),
      url: dashboardUrl,
    };

    const response = await fetch(data.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: APP_CONFIG.name,
        embeds: [embed],
      }),
    });

    if (!response.ok) {
      console.error(
        "Erreur webhook Discord:",
        response.status,
        await response.text()
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      "Erreur Discord:",
      error instanceof Error ? error.message : error
    );
    return false;
  }
}

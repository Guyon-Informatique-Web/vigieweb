// Envoi d'emails de notification via Resend
// Utilise React Email pour les templates

import { Resend } from "resend";
import { APP_CONFIG } from "@/config/app";
import { AlertEmail } from "@/components/emails/AlertEmail";

if (!process.env.RESEND_API_KEY) {
  throw new Error("La variable d'environnement RESEND_API_KEY est requise")
}
const resend = new Resend(process.env.RESEND_API_KEY);

interface AlertEmailData {
  to: string;
  siteName: string;
  siteUrl: string;
  alertTitle: string;
  alertMessage: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  siteId: string;
}

// Envoyer un email d'alerte a l'utilisateur
export async function sendAlertEmail(data: AlertEmailData): Promise<boolean> {
  try {
    const severityEmoji = {
      INFO: "i",
      WARNING: "!",
      CRITICAL: "!!",
    };

    const { error } = await resend.emails.send({
      from: `${APP_CONFIG.name} <${APP_CONFIG.email.from}>`,
      to: data.to,
      subject: `[${APP_CONFIG.name}] ${severityEmoji[data.severity]} ${data.alertTitle} : ${data.siteName}`,
      react: AlertEmail({
        siteName: data.siteName,
        siteUrl: data.siteUrl,
        alertTitle: data.alertTitle,
        alertMessage: data.alertMessage,
        severity: data.severity,
        dashboardUrl: `${APP_CONFIG.url}/dashboard/sites/${data.siteId}`,
        settingsUrl: `${APP_CONFIG.url}/dashboard/settings/notifications`,
      }),
    });

    if (error) {
      console.error("Erreur envoi email:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      "Erreur Resend:",
      error instanceof Error ? error.message : error
    );
    return false;
  }
}

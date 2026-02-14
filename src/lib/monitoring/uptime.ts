// Logique de check uptime
// Envoie une requete HTTP GET et mesure le temps de reponse

import type { SiteStatus } from "@/generated/prisma/client";

interface UptimeResult {
  status: SiteStatus;
  statusCode: number | null;
  responseTime: number | null;
  errorMessage: string | null;
}

export async function checkUptime(url: string): Promise<UptimeResult> {
  const start = Date.now();

  try {
    const controller = new AbortController();
    // Timeout de 10 secondes
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "VigieWeb Monitor/1.0",
      },
    });

    clearTimeout(timeout);
    const responseTime = Date.now() - start;
    const statusCode = response.status;

    // Determiner le statut selon le code HTTP et le temps de reponse
    let status: SiteStatus;

    if (statusCode >= 500) {
      status = "DOWN";
    } else if (statusCode === 404) {
      // 404 sur la page d'accueil = DOWN
      status = "DOWN";
    } else if (statusCode >= 400) {
      status = "DEGRADED";
    } else if (responseTime > 3000) {
      status = "DEGRADED";
    } else {
      status = "UP";
    }

    return { status, statusCode, responseTime, errorMessage: null };
  } catch (error) {
    const responseTime = Date.now() - start;
    const message =
      error instanceof Error ? error.message : "Erreur inconnue";

    return {
      status: "DOWN",
      statusCode: null,
      responseTime: responseTime > 10000 ? null : responseTime,
      errorMessage: message.includes("abort")
        ? "Timeout (10s)"
        : message,
    };
  }
}

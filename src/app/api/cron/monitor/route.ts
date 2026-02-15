// Cron job de monitoring
// Appele par Vercel Cron (quotidien sur Hobby, configurable sur Pro)
// Verifie quels sites doivent etre checkes selon leur plan

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/config/plans";
import { checkUptime } from "@/lib/monitoring/uptime";
import { checkSSL } from "@/lib/monitoring/ssl";
import { checkDomain } from "@/lib/monitoring/domain";
import { sendAlertEmail } from "@/lib/notifications/email";
import { sendDiscordAlert } from "@/lib/notifications/discord";
import { withErrorHandling } from "@/lib/api-error-handler";
import type { Plan, AlertType, Severity, SiteStatus } from "@/generated/prisma/client";

// Securiser le endpoint avec CRON_SECRET
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) return false;
  return authHeader === `Bearer ${cronSecret}`;
}

// Determiner le type d'alerte et la severite selon le resultat
function getAlertInfo(
  type: "uptime" | "ssl" | "domain",
  details: {
    status?: SiteStatus;
    daysRemaining?: number | null;
    errorMessage?: string | null;
  }
): { type: AlertType; severity: Severity; title: string; message: string } | null {
  if (type === "uptime") {
    if (details.status === "DOWN") {
      return {
        type: "SITE_DOWN",
        severity: "CRITICAL",
        title: "Site hors ligne",
        message: details.errorMessage || "Le site ne repond pas",
      };
    }
    if (details.status === "DEGRADED") {
      return {
        type: "SLOW_RESPONSE",
        severity: "WARNING",
        title: "Temps de reponse degrade",
        message: "Le temps de reponse depasse 3 secondes",
      };
    }
    return null;
  }

  if (type === "ssl") {
    const days = details.daysRemaining;
    if (days === null || days === undefined) return null;

    if (days <= 0) {
      return {
        type: "SSL_EXPIRED",
        severity: "CRITICAL",
        title: "Certificat SSL expire",
        message: "Le certificat SSL a expire",
      };
    }
    if (days <= 3) {
      return {
        type: "SSL_EXPIRING",
        severity: "CRITICAL",
        title: "Certificat SSL expire dans moins de 3 jours",
        message: `Le certificat SSL expire dans ${days} jour${days > 1 ? "s" : ""}`,
      };
    }
    if (days <= 14) {
      return {
        type: "SSL_EXPIRING",
        severity: "WARNING",
        title: "Certificat SSL expire bientot",
        message: `Le certificat SSL expire dans ${days} jours`,
      };
    }
    return null;
  }

  if (type === "domain") {
    const days = details.daysRemaining;
    if (days === null || days === undefined) return null;

    if (days <= 0) {
      return {
        type: "DOMAIN_EXPIRED",
        severity: "CRITICAL",
        title: "Nom de domaine expire",
        message: "Le nom de domaine a expire",
      };
    }
    if (days <= 7) {
      return {
        type: "DOMAIN_EXPIRING",
        severity: "CRITICAL",
        title: "Domaine expire dans moins de 7 jours",
        message: `Le domaine expire dans ${days} jour${days > 1 ? "s" : ""}`,
      };
    }
    if (days <= 30) {
      return {
        type: "DOMAIN_EXPIRING",
        severity: "WARNING",
        title: "Domaine expire bientot",
        message: `Le domaine expire dans ${days} jours`,
      };
    }
    return null;
  }

  return null;
}

// Anti-spam : ne pas envoyer d'alerte identique dans les 30 dernieres minutes
async function shouldCreateAlert(
  userId: string,
  siteId: string,
  type: AlertType
): Promise<boolean> {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

  const recentAlert = await prisma.alert.findFirst({
    where: {
      userId,
      siteId,
      type: type,
      createdAt: { gte: thirtyMinutesAgo },
    },
  });

  return !recentAlert;
}

// Info utilisateur necessaire pour les notifications
interface UserInfo {
  id: string;
  email: string;
  plan: string;
  notifyEmail: boolean;
  notifyDiscord: boolean;
  discordWebhookUrl: string | null;
}

// Creer une alerte et envoyer les notifications selon les preferences
async function createAlertAndNotify(
  user: UserInfo,
  siteId: string,
  siteName: string,
  siteUrl: string,
  alertData: { type: AlertType; severity: Severity; title: string; message: string }
): Promise<boolean> {
  const canAlert = await shouldCreateAlert(user.id, siteId, alertData.type);
  if (!canAlert) return false;

  // Creer l'alerte en BDD
  const alert = await prisma.alert.create({
    data: {
      userId: user.id,
      siteId,
      ...alertData,
    },
  });

  // Envoyer les notifications en parallele (sans bloquer le cron)
  const notifications: Promise<void>[] = [];

  // Email
  if (user.notifyEmail) {
    notifications.push(
      sendAlertEmail({
        to: user.email,
        siteName,
        siteUrl,
        alertTitle: alertData.title,
        alertMessage: alertData.message,
        severity: alertData.severity,
        siteId,
      }).then((sent) => {
        if (sent) {
          // Marquer l'email comme envoye
          prisma.alert.update({
            where: { id: alert.id },
            data: { emailSent: true },
          }).catch(() => {});
        }
      })
    );
  }

  // Discord (uniquement si le plan le permet)
  const planConfig = PLANS[user.plan as Plan];
  const discordAllowed = (planConfig.limits.notifications as readonly string[]).includes("discord");

  if (user.notifyDiscord && user.discordWebhookUrl && discordAllowed) {
    notifications.push(
      sendDiscordAlert({
        webhookUrl: user.discordWebhookUrl,
        siteName,
        siteUrl,
        alertTitle: alertData.title,
        alertMessage: alertData.message,
        severity: alertData.severity,
        siteId,
      }).then((sent) => {
        if (sent) {
          prisma.alert.update({
            where: { id: alert.id },
            data: { discordSent: true },
          }).catch(() => {});
        }
      })
    );
  }

  // Attendre les notifications sans bloquer en cas d'erreur
  await Promise.allSettled(notifications);

  return true;
}

export const GET = withErrorHandling(async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const now = new Date();
  let checkedCount = 0;
  let alertCount = 0;

  // Recuperer tous les sites actifs avec les preferences de notification
  const sites = await prisma.site.findMany({
    where: { isActive: true },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          plan: true,
          notifyEmail: true,
          notifyDiscord: true,
          discordWebhookUrl: true,
        },
      },
    },
  });

  // Filtrer les sites qui doivent etre verifies selon leur plan
  const sitesToCheck = sites.filter((site) => {
    if (!site.lastCheckedAt) return true;

    const plan = PLANS[site.user.plan as Plan];
    const intervalMs = plan.limits.checkInterval * 60 * 1000;
    const elapsed = now.getTime() - new Date(site.lastCheckedAt).getTime();

    return elapsed >= intervalMs;
  });

  // Verifier chaque site (par lots de 5 pour eviter la surcharge)
  const batchSize = 5;
  for (let i = 0; i < sitesToCheck.length; i += batchSize) {
    const batch = sitesToCheck.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (site) => {
        try {
          // Check uptime
          const uptimeResult = await checkUptime(site.url);
          await prisma.check.create({
            data: {
              siteId: site.id,
              status: uptimeResult.status,
              statusCode: uptimeResult.statusCode,
              responseTime: uptimeResult.responseTime,
              errorMessage: uptimeResult.errorMessage,
              checkType: "UPTIME",
            },
          });

          // Detecter si le site etait DOWN et repasse UP
          if (
            site.currentStatus === "DOWN" &&
            uptimeResult.status === "UP"
          ) {
            const created = await createAlertAndNotify(
              site.user,
              site.id,
              site.name,
              site.url,
              {
                type: "SITE_UP",
                severity: "INFO",
                title: "Site de retour en ligne",
                message: `${site.name} est de nouveau accessible`,
              }
            );
            if (created) alertCount++;
          }

          // Creer une alerte si probleme detecte
          const uptimeAlert = getAlertInfo("uptime", {
            status: uptimeResult.status,
            errorMessage: uptimeResult.errorMessage,
          });

          if (uptimeAlert) {
            const created = await createAlertAndNotify(
              site.user,
              site.id,
              site.name,
              site.url,
              uptimeAlert
            );
            if (created) alertCount++;
          }

          // Check SSL (une fois par heure max)
          const lastSslCheck = await prisma.check.findFirst({
            where: {
              siteId: site.id,
              checkType: "SSL",
              checkedAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
            },
          });

          let sslUpdate: { sslExpiresAt?: Date; sslIssuer?: string } = {};

          if (!lastSslCheck) {
            const sslResult = await checkSSL(site.url);
            await prisma.check.create({
              data: {
                siteId: site.id,
                status: sslResult.valid ? "UP" : "DEGRADED",
                errorMessage: sslResult.errorMessage,
                checkType: "SSL",
              },
            });

            if (sslResult.expiresAt) {
              sslUpdate = {
                sslExpiresAt: sslResult.expiresAt,
                sslIssuer: sslResult.issuer || undefined,
              };
            }

            const sslAlert = getAlertInfo("ssl", {
              daysRemaining: sslResult.daysRemaining,
            });

            if (sslAlert) {
              const created = await createAlertAndNotify(
                site.user,
                site.id,
                site.name,
                site.url,
                sslAlert
              );
              if (created) alertCount++;
            }
          }

          // Check domaine (une fois par jour max)
          const lastDomainCheck = await prisma.check.findFirst({
            where: {
              siteId: site.id,
              checkType: "DOMAIN",
              checkedAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
              },
            },
          });

          let domainUpdate: { domainExpiresAt?: Date; domainRegistrar?: string } = {};

          if (!lastDomainCheck) {
            const domainResult = await checkDomain(site.url);
            await prisma.check.create({
              data: {
                siteId: site.id,
                status: domainResult.expiresAt ? "UP" : "UNKNOWN",
                errorMessage: domainResult.errorMessage,
                checkType: "DOMAIN",
              },
            });

            if (domainResult.expiresAt) {
              domainUpdate.domainExpiresAt = domainResult.expiresAt;
            }
            if (domainResult.registrar) {
              domainUpdate.domainRegistrar = domainResult.registrar;
            }

            const domainAlert = getAlertInfo("domain", {
              daysRemaining: domainResult.daysRemaining,
            });

            if (domainAlert) {
              const created = await createAlertAndNotify(
                site.user,
                site.id,
                site.name,
                site.url,
                domainAlert
              );
              if (created) alertCount++;
            }
          }

          // Calculer les stats uptime sur 30 jours
          const thirtyDaysAgo = new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000
          );
          const recentUptimeChecks = await prisma.check.findMany({
            where: {
              siteId: site.id,
              checkType: "UPTIME",
              checkedAt: { gte: thirtyDaysAgo },
            },
          });

          const totalChecks = recentUptimeChecks.length;
          const upChecks = recentUptimeChecks.filter(
            (c) => c.status === "UP"
          ).length;
          const uptimePercentage =
            totalChecks > 0 ? (upChecks / totalChecks) * 100 : null;

          const responseTimes = recentUptimeChecks
            .filter((c) => c.responseTime !== null)
            .map((c) => c.responseTime!);
          const avgResponseTime =
            responseTimes.length > 0
              ? Math.round(
                  responseTimes.reduce((a, b) => a + b, 0) /
                    responseTimes.length
                )
              : null;

          // Mettre a jour le site
          await prisma.site.update({
            where: { id: site.id },
            data: {
              currentStatus: uptimeResult.status,
              lastCheckedAt: now,
              uptimePercentage,
              avgResponseTime,
              ...sslUpdate,
              ...domainUpdate,
            },
          });

          checkedCount++;
        } catch (error) {
          console.error(
            `Erreur monitoring ${site.name}:`,
            error instanceof Error ? error.message : error
          );
        }
      })
    );
  }

  return NextResponse.json({
    success: true,
    checked: checkedCount,
    alerts: alertCount,
    total: sitesToCheck.length,
  });
}, "MONITORING");

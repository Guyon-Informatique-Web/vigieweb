// Types lies aux alertes

export type AlertType =
  | "SITE_DOWN"
  | "SITE_UP"
  | "SSL_EXPIRING"
  | "SSL_EXPIRED"
  | "DOMAIN_EXPIRING"
  | "DOMAIN_EXPIRED"
  | "SLOW_RESPONSE"
  | "STATUS_CODE_ERROR";

export type Severity = "INFO" | "WARNING" | "CRITICAL";

export interface Alert {
  id: string;
  userId: string;
  siteId: string;
  type: AlertType;
  severity: Severity;
  title: string;
  message: string;
  isRead: boolean;
  isResolved: boolean;
  resolvedAt: Date | null;
  emailSent: boolean;
  discordSent: boolean;
  createdAt: Date;
}

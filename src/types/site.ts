// Types lies aux sites surveilles

export type SiteStatus = "UP" | "DOWN" | "DEGRADED" | "UNKNOWN";

export interface Site {
  id: string;
  userId: string;
  name: string;
  url: string;
  isActive: boolean;
  currentStatus: SiteStatus;
  lastCheckedAt: Date | null;
  sslExpiresAt: Date | null;
  sslIssuer: string | null;
  domainExpiresAt: Date | null;
  uptimePercentage: number | null;
  avgResponseTime: number | null;
  createdAt: Date;
  updatedAt: Date;
}
